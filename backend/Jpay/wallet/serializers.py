from decimal import Decimal
from rest_framework import serializers
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


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # No exponemos password ni campos de permisos
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


class SolicitudPrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudPrestamo
        fields = "__all__"


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


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = "__all__"


class CuentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuenta
        fields = "__all__"


class CuentaVinculadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaVinculada
        fields = "__all__"


class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = "__all__"



class SimuladorInputSerializer(serializers.Serializer):
    monto = serializers.DecimalField(max_digits=12, decimal_places=2)
    tasa_nominal_anual = serializers.DecimalField(max_digits=6, decimal_places=2)
    plazo_meses = serializers.IntegerField(min_value=1)
    sistema = serializers.ChoiceField(choices=["frances", "aleman", "americano"])

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > Decimal("100000000"):
            raise serializers.ValidationError("Amount is too large.")
        return value

    def validate_tasa_nominal_anual(self, value):
        if value < 0:
            raise serializers.ValidationError("Rate cannot be negative.")
        if value > Decimal("300"):
            raise serializers.ValidationError("Rate seems unrealistically high.")
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