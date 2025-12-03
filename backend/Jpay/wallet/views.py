from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .simulacion import simular_prestamo
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
 
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