from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .simulacion import simular_prestamo
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from django.utils import timezone



from decimal import Decimal
from django.db import transaction
from .qr_utils import QRPaymentData, encode_qr_payload, decode_qr_payload

from .biometrics import get_biometric_provider

 
from .models import (
    Usuario,
    SolicitudPrestamo,
    Sesion,
    Prestamo,
    Cuota,
    Pago,
    Notificacion,
    Cuenta,
    CuentaVinculada,
    Movimiento,
    QRPaymentIntent,
    BiometricVerification,
    KYCVerification,
)
from .serializers import (
    UsuarioSerializer,
    SolicitudPrestamoSerializer,
    SesionSerializer,
    PrestamoSerializer,
    CuotaSerializer,
    PagoSerializer,
    NotificacionSerializer,
    CuentaSerializer,
    CuentaVinculadaSerializer,
    MovimientoSerializer,
    SimuladorInputSerializer,
    SimuladorResultadoSerializer,
    SignUpSerializer,
    QRGenerateSerializer,
    QRGenerateResponseSerializer,
    QRParseSerializer,
    QRParseResultSerializer,
    QRPagarSerializer,
    TransferenciaSerializer,
    BiometricVerifySerializer,
    KYCDNISerializer,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class SolicitudPrestamoViewSet(viewsets.ModelViewSet):
    queryset = SolicitudPrestamo.objects.all()
    serializer_class = SolicitudPrestamoSerializer


class SesionViewSet(viewsets.ModelViewSet):
    queryset = Sesion.objects.all()
    serializer_class = SesionSerializer


class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer

    def perform_create(self, serializer):
        prestamo = serializer.save()
        prestamo.generar_cuotas()


class CuotaViewSet(viewsets.ModelViewSet):
    queryset = Cuota.objects.all()
    serializer_class = CuotaSerializer


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer


class CuentaViewSet(viewsets.ModelViewSet):
    queryset = Cuenta.objects.all()
    serializer_class = CuentaSerializer


class CuentaVinculadaViewSet(viewsets.ModelViewSet):
    queryset = CuentaVinculada.objects.all()
    serializer_class = CuentaVinculadaSerializer


class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer




class SimuladorPrestamoView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SimuladorInputSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "Loan simulation failed. Please fix the errors and try again.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        cuotas, total_intereses, total_pagado = simular_prestamo(
            monto=data["monto"],
            tna=data["tasa_nominal_anual"],
            plazo_meses=data["plazo_meses"],
            sistema=data["sistema"],
        )

        resultado = {
            "sistema": data["sistema"],
            "monto": data["monto"],
            "tasa_nominal_anual": data["tasa_nominal_anual"],
            "plazo_meses": data["plazo_meses"],
            "total_intereses": total_intereses,
            "total_pagado": total_pagado,
            "cuotas": cuotas,
        }

        output_serializer = SimuladorResultadoSerializer(resultado)

        return Response(
            {
                "message": "Loan simulation completed successfully.",
                "result": output_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    
class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data["token"])
        user = token.user
        return Response(
            {
                "token": token.key,
                "user_id": user.pk,
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SignUpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "user": UsuarioSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
    

class GenerarQRView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = QRGenerateSerializer(data=request.data, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "Failed to generate QR. Please fix the errors and try again.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cuenta_destino = serializer.context["cuenta_destino"]
        monto = serializer.validated_data.get("monto")
        descripcion = serializer.validated_data.get("descripcion", "")

        intent = QRPaymentIntent.objects.create(
            cuenta_destino=cuenta_destino,
            monto=monto,
            descripcion=descripcion,
        )

        data = QRPaymentData(
            version=1,
            intent_id=str(intent.id),
            cuenta_destino_identifier=str(cuenta_destino.cvu),
            monto=monto,
            moneda=intent.moneda,
            descripcion=descripcion,
        )
        qr_payload = encode_qr_payload(data)

        resp = QRGenerateResponseSerializer(
            {
                "qr_payload": qr_payload,
                "intent_id": str(intent.id),
                "tiene_monto_fijo": intent.tiene_monto_fijo,
                "moneda": intent.moneda,
                "monto": intent.monto,
                "descripcion": intent.descripcion,
            }
        ).data

        return Response(
            {"message": "QR generated successfully.", "data": resp},
            status=status.HTTP_201_CREATED,
        )


class ParsearQRView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = QRParseSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "Failed to parse QR.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = serializer.validated_data["qr_payload"]

        try:
            data = decode_qr_payload(payload)
        except ValueError as exc:
            return Response(
                {"message": str(exc), "errors": {"qr_payload": [str(exc)]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        intent = QRPaymentIntent.objects.filter(id=data.intent_id).first()

        if intent is not None:
            cuenta = intent.cuenta_destino
            result = {
                "intent_id": str(intent.id),
                "cuenta_destino_id": cuenta.id,
                "cuenta_destino_alias": cuenta.alias,
                "cuenta_destino_cvu": str(cuenta.cvu),
                "titular": cuenta.usuario.get_full_name()
                if cuenta.usuario
                else "",
                "monto": intent.monto,
                "moneda": intent.moneda,
                "descripcion": intent.descripcion,
            }
        else:
            result = {
                "intent_id": data.intent_id,
                "cuenta_destino_id": None,
                "cuenta_destino_alias": "",
                "cuenta_destino_cvu": data.cuenta_destino_identifier,
                "titular": "",
                "monto": data.monto,
                "moneda": data.moneda,
                "descripcion": data.descripcion,
            }

        resp = QRParseResultSerializer(result).data

        return Response(
            {"message": "QR parsed successfully.", "data": resp},
            status=status.HTTP_200_OK,
        )

class PagarQRView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = QRPagarSerializer(data=request.data, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "Failed to process QR payment.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = serializer.validated_data["qr_payload"]
        cuenta_origen = serializer.context["cuenta_origen"]
        monto_override = serializer.validated_data.get("monto")

        try:
            data = decode_qr_payload(payload)
        except ValueError as exc:
            return Response(
                {"message": str(exc), "errors": {"qr_payload": [str(exc)]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        intent = QRPaymentIntent.objects.filter(id=data.intent_id).select_for_update().first()
        if intent is None:
            return Response(
                {
                    "message": "QR intent not found.",
                    "errors": {"qr_payload": ["Unknown or expired QR intent."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if intent.estado != QRPaymentIntent.Estado.PENDIENTE:
            return Response(
                {
                    "message": "QR is no longer payable.",
                    "errors": {"estado": [f"Intent is {intent.estado}."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cuenta_destino = intent.cuenta_destino

        if intent.monto is not None:
            monto = intent.monto
        else:
            if monto_override is None:
                return Response(
                    {
                        "message": "Amount required for this QR.",
                        "errors": {"monto": ["This QR has no fixed amount; please provide one."]},
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            monto = monto_override

        if cuenta_origen.saldo < monto:
            return Response(
                {
                    "message": "Insufficient funds.",
                    "errors": {"saldo": ["Insufficient balance in source account."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cuenta_origen.saldo -= monto
        cuenta_destino.saldo += monto
        cuenta_origen.save()
        cuenta_destino.save()

        Movimiento.objects.create(
            cuenta=cuenta_origen,
            monto=-monto,
            tipo=Movimiento.Tipo.TRANSFERENCIA,
        )

        Movimiento.objects.create(
            cuenta=cuenta_destino,
            monto=monto,
            tipo=Movimiento.Tipo.TRANSFERENCIA,
        )

        intent.estado = QRPaymentIntent.Estado.PAGADO
        intent.save()

        return Response(
            {
                "message": "QR payment processed successfully.",
                "data": {
                    "intent_id": str(intent.id),
                    "cuenta_origen_id": cuenta_origen.id,
                    "cuenta_destino_id": cuenta_destino.id,
                    "monto": str(monto),
                    "moneda": intent.moneda,
                },
            },
            status=status.HTTP_200_OK,
        )
    

class TransferenciaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = TransferenciaSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "Transfer failed. Please fix the errors and try again.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cuenta_origen = serializer.validated_data["cuenta_origen_obj"]
        cuenta_destino = serializer.validated_data["cuenta_destino_obj"]
        monto = serializer.validated_data["monto"]
        descripcion = serializer.validated_data.get("descripcion", "")

        # update balances
        cuenta_origen.saldo = Decimal(str(cuenta_origen.saldo)) - monto
        cuenta_destino.saldo = Decimal(str(cuenta_destino.saldo)) + monto
        cuenta_origen.save()
        cuenta_destino.save()

        # movements
        Movimiento.objects.create(
            cuenta=cuenta_origen,
            monto=float(-monto),
            tipo=Movimiento.Tipo.TRANSFERENCIA,
            comprobante=None,
        )
        Movimiento.objects.create(
            cuenta=cuenta_destino,
            monto=float(monto),
            tipo=Movimiento.Tipo.TRANSFERENCIA,
            comprobante=None,
        )

        return Response(
            {
                "message": "Transfer completed successfully.",
                "data": {
                    "cuenta_origen_id": cuenta_origen.id,
                    "cuenta_destino_id": cuenta_destino.id,
                    "monto": str(monto),
                    "descripcion": descripcion,
                },
            },
            status=status.HTTP_200_OK,
        )
    


class BiometricVerifyView(APIView):
    """
    Facade de verificación biométrica.
    Hoy usa DummyBiometricProvider, mañana se enchufa a uno real.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = BiometricVerifySerializer(
            data=request.data,
            context={"request": request},
        )

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "Biometric verification failed. Invalid request data.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        sample = serializer.validated_data["sample"]
        device_id = serializer.validated_data.get("device_id") or None
        sesion = serializer.context.get("sesion_obj")

        provider = get_biometric_provider()

        # 1) Creamos la verificación en estado pendiente
        verification = BiometricVerification.objects.create(
            usuario=request.user,
            sesion=sesion,
            proveedor="dummy",  # en el futuro: el nombre real del vendor
            estado=BiometricVerification.Estado.PENDIENTE,
        )

        # 2) Llamamos al proveedor (hoy dummy)
        result = provider.verify(
            usuario_id=request.user.id,
            device_id=device_id,
            sample=sample,
        )

        # 3) Actualizamos el estado según el resultado
        if result.success:
            verification.marcar_exitosa(score=result.score, razon=result.reason)
        else:
            verification.marcar_fallida(score=result.score, razon=result.reason)

        
        if sesion and result.success:
            sesion.biometria_verificada_en = timezone.now()
            sesion.save(update_fields=["biometria_verificada_en"])

        return Response(
            {
                "message": "Biometric verification completed.",
                "data": {
                    "verification_id": verification.id,
                    "success": result.success,
                    "score": result.score,
                    "reason": result.reason,
                    "estado": verification.estado,
                    "usuario": UsuarioSerializer(request.user).data,
                },
            },
            status=status.HTTP_200_OK,
        )


class KYCUploadDNIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = KYCDNISerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response(
                {
                    "message": "KYC DNI upload failed. Please fix the errors and try again.",
                    "errors": exc.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        kyc = serializer.create_or_update_kyc(request.user)

        return Response(
            {
                "message": "DNI images uploaded successfully.",
                "data": {
                    "estado": kyc.estado,
                    "usuario_id": kyc.usuario_id,
                },
            },
            status=status.HTTP_200_OK,
        )