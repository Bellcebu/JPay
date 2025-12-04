from rest_framework import viewsets, status, permissions
from wallet.utils.rates import obtener_tna_por_score
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .utils.simulacion import simular_prestamo
from rest_framework.exceptions import ValidationError
from django.utils import timezone

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


from decimal import Decimal
from django.db import transaction
from .utils.qr_utils import QRPaymentData, encode_qr_payload, decode_qr_payload
from .services.transfer_service import TransferService
from wallet.services.notification_service import NotificationService


from wallet.utils.biometrics import get_biometric_provider

 
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
    BiometricVerifySerializer,
    KYCDNISerializer,
    SignUpSerializer,
    CustomTokenObtainPairSerializer,
    LookupCuentaSerializer
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

class NotificacionReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            noti = Notificacion.objects.get(pk=pk, usuario=request.user)
        except Notificacion.DoesNotExist:
            return Response({"detail": "No encontrada."}, status=404)

        noti.leida = True
        noti.save()

        return Response({"message": "Notificación marcada como leída."})

class NotificacionListView(viewsets.generics.ListAPIView):
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(
            usuario=self.request.user
        ).order_by("-creado_en")

class LookupCuentaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cvu = request.data.get("cvu")

        try:
            cuenta = Cuenta.objects.get(cvu=cvu)
        except Cuenta.DoesNotExist:
            return Response({"exists": False}, status=404)

        return Response({
            "exists": True,
            "cvu": cuenta.cvu,
            "alias": cuenta.alias,
            "titular": f"{cuenta.usuario.nombre} {cuenta.usuario.apellido}",
        })


class MovimientoListView(viewsets.generics.ListAPIView):
    serializer_class = MovimientoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Movimiento.objects.filter(
            cuenta=self.request.user.cuenta
        ).order_by("-creado_en")


class CuentaViewSet(viewsets.ModelViewSet):
    queryset = Cuenta.objects.all()
    serializer_class = CuentaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        # Return only my own account
        cuenta = request.user.cuenta
        serializer = self.get_serializer(cuenta)
        return Response([serializer.data])

    def retrieve(self, request, *args, **kwargs):
        cuenta = self.get_object()
        if cuenta.usuario != request.user:
            return Response({"detail": "No autorizado."}, status=403)
        return super().retrieve(request, *args, **kwargs)


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
            tna=obtener_tna_por_score(request.user.score),
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
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extiende el serializer de SimpleJWT para incluir los datos del usuario
    en la respuesta de login.
    """

    def validate(self, attrs):
        data = super().validate(attrs)  # esto genera access + refresh
        user = self.user

        # Agregamos datos del usuario
        data["user"] = UsuarioSerializer(user).data

        # Opcional: si querés mantener compatibilidad con `token`:
        # data["token"] = data["access"]

        return data


class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Body: { "username": "...", "password": "..." }
    Respuesta: { "refresh": "...", "access": "...", "user": { ... } }
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Con JWT simple, el logout real lo hace el frontend
        (borrando access + refresh).
        Si después activás blacklist, acá podrías invalidar el refresh token.
        """
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SignUpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Crear tokens JWT para el nuevo usuario
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        from wallet.services.cuenta_service import CuentaService
        cuenta = CuentaService.crear_cuenta_para_usuario(user)

        return Response(
            {
                "message": "User created successfully.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UsuarioSerializer(user).data,
                "cuenta": {
                    "cvu": cuenta.cvu,
                    "alias": cuenta.alias,
                    "saldo": cuenta.saldo,
                },
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

    def post(self, request):
        origen = request.user.cuenta
        cvu_destino = request.data.get("cvu_destino")
        monto = Decimal(request.data.get("monto"))

        try:
            destino = Cuenta.objects.get(cvu=cvu_destino)
        except Cuenta.DoesNotExist:
            return Response({"message": "Cuenta destino no encontrada."}, status=404)

        try:
            referencia = TransferService.realizar_transferencia(
                origen, destino, monto
            )
        except ValueError as e:
            return Response({"message": str(e)}, status=400)
        
        NotificationService.notificar_envio(
            usuario=origen.usuario,
            monto=monto,
            alias_destino=destino.alias
        )

        NotificationService.notificar_recepcion(
            usuario=destino.usuario,
            monto=monto,
            alias_origen=origen.alias
        )


        return Response({
            "message": "Transferencia realizada con éxito",
            "referencia": referencia,
        })

class ComprobanteDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, referencia):
        try:
            movimiento = Movimiento.objects.get(
                referencia=referencia,
                cuenta=request.user.cuenta,  # user can only download THEIR comprobantes
                tipo=Movimiento.Tipo.DEBITO
            )
        except Movimiento.DoesNotExist:
            return Response(
                {"message": "Comprobante no encontrado."},
                status=404
            )

        if not movimiento.comprobante:
            return Response(
                {"message": "La transferencia no tiene comprobante."},
                status=404
            )

        return Response({"url": movimiento.comprobante.url})



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