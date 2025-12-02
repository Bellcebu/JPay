# app/serializers.py

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