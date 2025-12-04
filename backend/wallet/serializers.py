from .utils.qr_utils import QRPaymentData
from decimal import Decimal
from rest_framework import serializers

from rest_framework import permissions, status
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = [
            "id",
            "titulo",
            "cuerpo",
            "prioridad",
            "tipo",
            "creado_en",
            "leida",
        ]

        # Fields the user should never set manually
        read_only_fields = [
            "id",
            "titulo",
            "cuerpo",
            "prioridad",
            "tipo",
            "creado_en",
        ]

        
        write_only_fields = ["leida"]

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "dni",
            "fecha_nacimiento",
            "telefono",
            "estado_verificacion",
            "score",
        ]
        read_only_fields = [
            "estado_verificacion",
            "score",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }


class SolicitudPrestamoSerializer(serializers.ModelSerializer):
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        write_only = True,
        source = "user",
    )

    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = SolicitudPrestamo
        fields = "__all__"
        read_only_fields = [
            "motivo_de_rechazo",
            "is_aprovado",
            "creado_en",
        ]


class SesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesion
        fields = "__all__"


class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = "__all__"


class CuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuota
        fields = "__all__"


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = "__all__"


class CuentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuenta
        fields = [
            "id",
            "cvu",
            "alias",
            "saldo",
            "estado_verificacion",
        ]
class LookupCuentaSerializer(serializers.Serializer):
    cvu = serializers.CharField()


class CuentaVinculadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaVinculada
        fields = "__all__"


class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            "id",
            "tipo",
            "monto",
            "descripcion",
            "creado_en",
            "referencia",
        ]


class SimuladorInputSerializer(serializers.Serializer):
    monto = serializers.DecimalField(max_digits=12, decimal_places=2)
    plazo_meses = serializers.IntegerField(min_value=1)
    sistema = serializers.ChoiceField(choices=["frances", "aleman", "americano"])

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > Decimal("100000000"):
            raise serializers.ValidationError("Amount is too large.")
        return value

    def validate_plazo_meses(self, value):
        if value <= 0:
            raise serializers.ValidationError("Term must be at least 1 month.")
        if value > 600:
            raise serializers.ValidationError("Term is too long.")
        return value

    def validate(self, attrs):
        # Example of cross-field validation if you want it
        # e.g. prevent extremely high amount with extremely long term
        monto = attrs.get("monto")
        plazo = attrs.get("plazo_meses")

        if monto is not None and plazo is not None:
            if monto > Decimal("1000000") and plazo > 360:
                raise serializers.ValidationError(
                    {
                        "plazo_meses": [
                            "For amounts above 1,000,000 the maximum term is 360 months."
                        ]
                    }
                )
        return attrs


class SimuladorCuotaSerializer(serializers.Serializer):
    numero = serializers.IntegerField()
    cuota = serializers.DecimalField(max_digits=12, decimal_places=2)
    capital = serializers.DecimalField(max_digits=12, decimal_places=2)
    interes = serializers.DecimalField(max_digits=12, decimal_places=2)
    saldo = serializers.DecimalField(max_digits=12, decimal_places=2)


class SimuladorResultadoSerializer(serializers.Serializer):
    sistema = serializers.CharField()
    monto = serializers.DecimalField(max_digits=12, decimal_places=2)
    tasa_nominal_anual = serializers.DecimalField(max_digits=6, decimal_places=2)
    plazo_meses = serializers.IntegerField()
    total_intereses = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_pagado = serializers.DecimalField(max_digits=14, decimal_places=2)
    cuotas = SimuladorCuotaSerializer(many=True)



class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "password",
            "password2",
            "first_name",
            "last_name",
            "dni",
            "fecha_nacimiento",
            "telefono",
        ]
    
    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_dni(self, value):
        if Usuario.objects.filter(dni=value).exists():
            raise serializers.ValidationError("A user with this DNI already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password2": ["Passwords do not match."]}
            )
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password2", None)
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
    






class QRGenerateSerializer(serializers.Serializer):
    cuenta_destino_id = serializers.IntegerField()
    monto = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=False, allow_null=True
    )
    descripcion = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_cuenta_destino_id(self, value):
        try:
            cuenta = Cuenta.objects.get(id=value)
        except Cuenta.DoesNotExist:
            raise serializers.ValidationError("Destination account not found.")
        self.context["cuenta_destino"] = cuenta
        return value


class QRGenerateResponseSerializer(serializers.Serializer):
    qr_payload = serializers.CharField()
    intent_id = serializers.CharField()
    tiene_monto_fijo = serializers.BooleanField()
    moneda = serializers.CharField()
    monto = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    descripcion = serializers.CharField()


class QRParseSerializer(serializers.Serializer):
    qr_payload = serializers.CharField()


class QRParseResultSerializer(serializers.Serializer):
    intent_id = serializers.CharField()
    cuenta_destino_id = serializers.IntegerField(required=False)
    cuenta_destino_alias = serializers.CharField(required=False, allow_blank=True)
    cuenta_destino_cvu = serializers.CharField(required=False, allow_blank=True)
    titular = serializers.CharField(required=False, allow_blank=True)
    monto = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    moneda = serializers.CharField()
    descripcion = serializers.CharField()


class QRPagarSerializer(serializers.Serializer):
    qr_payload = serializers.CharField()
    cuenta_origen_id = serializers.IntegerField()
    monto = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=False, allow_null=True
    )

    def validate_cuenta_origen_id(self, value):
        try:
            cuenta = Cuenta.objects.get(id=value)
        except Cuenta.DoesNotExist:
            raise serializers.ValidationError("Source account not found.")
        self.context["cuenta_origen"] = cuenta
        return value

    

class BiometricVerifySerializer(serializers.Serializer):
    sample = serializers.CharField(
        help_text="Token/snapshot/resultado que venga del cliente (por ahora string dummy)."
    )
    device_id = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Identificador lógico del dispositivo (opcional).",
    )
    sesion_id = serializers.IntegerField(
        required=False,
        help_text="ID de Sesion para asociar la verificación (opcional).",
    )

    def validate_sesion_id(self, value):
        try:
            sesion = Sesion.objects.get(id=value)
        except Sesion.DoesNotExist:
            raise serializers.ValidationError("Session not found.")
        self.context["sesion_obj"] = sesion
        return value
    

class KYCDNISerializer(serializers.Serializer):
    dni_frente = serializers.ImageField()
    dni_dorso = serializers.ImageField()

    def create_or_update_kyc(self, usuario):
        kyc, _ = KYCVerification.objects.get_or_create(usuario=usuario)
        kyc.dni_frente = self.validated_data["dni_frente"]
        kyc.dni_dorso = self.validated_data["dni_dorso"]
        # por ahora siempre pendiente; más adelante acá enchufás proveedor real
        kyc.estado = KYCVerification.Estado.PENDIENTE
        kyc.comentario = "KYC created with dummy flow."
        kyc.save()
        return kyc
    


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extiende el serializer de SimpleJWT para incluir datos del usuario
    en la respuesta del login.
    """

    def validate(self, attrs):
        data = super().validate(attrs)

        # data ya tiene: access, refresh
        user = self.user

        # Podés agregar lo que quieras
        data["user"] = UsuarioSerializer(user).data

        return data
    
