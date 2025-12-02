from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    class EstadoVerificacion(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        VERIFICADO = "verificado", "Verificado"
        BLOQUEADO = "bloqueado", "Bloqueado"

    dni = models.BigIntegerField(unique=True)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=20)
    estado_verificacion = models.CharField(
        max_length=20,
        choices=EstadoVerificacion.choices,
        default=EstadoVerificacion.PENDIENTE,
    )
    score = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.dni})"


class SolicitudPrestamo(models.Model):
    monto_solicitado = models.DecimalField(max_digits=12, decimal_places=2)
    plazo_meses = models.PositiveIntegerField()
    is_aprobado = models.BooleanField(default=False)
    motivo_de_rechazo = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        default=None,
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="solicitudes_prestamo",
    )

    def __str__(self):
        return f"Solicitud #{self.id} - {self.usuario}"


class Sesion(models.Model):
    dispositivo = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    creado_en = models.DateTimeField(auto_now_add=True)
    expirada_en = models.DateTimeField(null=True, blank=True)
    ultima_actividad = models.DateTimeField(auto_now=True)
    is_activa = models.BooleanField(default=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="sesiones",
    )

    def __str__(self):
        return f"Sesión {self.id} - {self.usuario}"


class Prestamo(models.Model):
    class Estado(models.TextChoices):
        APROBADO = "aprobado", "Aprobado"
        DESEMBOLSADO = "desembolsado", "Desembolsado"
        CANCELADO = "cancelado", "Cancelado"
        MORA = "mora", "Mora"

    monto = models.DecimalField(max_digits=12, decimal_places=2)
    plazo_meses = models.PositiveIntegerField()
    tep = models.DecimalField(max_digits=6, decimal_places=2)
    cft = models.DecimalField(max_digits=6, decimal_places=2)
    tna = models.DecimalField(max_digits=6, decimal_places=2)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.APROBADO,
    )

    ultima_refinanciacion = models.DateField(null=True, blank=True)
    fecha_desembolso = models.DateField(null=True, blank=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.RESTRICT,
        related_name="prestamos",
    )
    solicitud_prestamo = models.OneToOneField(
        "SolicitudPrestamo",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="prestamo",
    )

    def __str__(self):
        return f"Préstamo #{self.id} - {self.usuario}"


class Cuota(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        PAGADA = "pagada", "Pagada"
        VENCIDA = "vencida", "Vencida"

    fecha_vencimiento = models.DateField()
    capital = models.DecimalField(max_digits=12, decimal_places=2)
    interes = models.DecimalField(max_digits=12, decimal_places=2)
    impuestos = models.DecimalField(max_digits=12, decimal_places=2)
    saldo_cuota = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )

    prestamo = models.ForeignKey(
        Prestamo,
        on_delete=models.CASCADE,
        related_name="cuotas",
    )

    def __str__(self):
        return f"Cuota #{self.id} - Préstamo #{self.prestamo_id}"


class Pago(models.Model):
    importe = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    comprobante = models.FileField(
        upload_to="comprobantes/pagos/",
        null=True,
        blank=True,
    )

    cuota = models.OneToOneField(
        Cuota,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="pago",
    )

    def __str__(self):
        return f"Pago #{self.id} - {self.importe}"


class Notificacion(models.Model):
    class Tipo(models.TextChoices):
        VENCIMIENTO = "vencimiento", "Vencimiento"
        PAGO = "pago", "Pago"
        APROBACION = "aprobacion", "Aprobación"
        RECHAZO = "rechazo", "Rechazo"
        CAMBIO_PERFIL = "cambio_perfil", "Cambio de perfil"
        ALERTA = "alerta", "Alerta"

    class Prioridad(models.TextChoices):
        BAJA = "baja", "Baja"
        MEDIA = "media", "Media"
        ALTA = "alta", "Alta"

    titulo = models.CharField(max_length=255)
    cuerpo = models.TextField()
    prioridad = models.CharField(
        max_length=10,
        choices=Prioridad.choices,
        default=Prioridad.MEDIA,
    )
    tipo = models.CharField(
        max_length=20,
        choices=Tipo.choices,
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    leida = models.BooleanField(default=False)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="notificaciones",
    )

    def __str__(self):
        return f"{self.titulo} - {self.usuario}"


class Cuenta(models.Model):
    class EstadoVerificacion(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        VERIFICADO = "verificado", "Verificado"
        BLOQUEADA = "bloqueada", "Bloqueada"

    estado_verificacion = models.CharField(
        max_length=20,
        choices=EstadoVerificacion.choices,
        default=EstadoVerificacion.PENDIENTE,
    )
    # CVU/CBU son 22 dígitos → usar CharField, no BigInteger
    cvu = models.CharField(max_length=22, unique=True)
    saldo = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    alias = models.CharField(max_length=50, unique=True)

    usuario = models.OneToOneField(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="cuenta",
    )

    def __str__(self):
        return f"Cuenta {self.cvu}"


class CuentaVinculada(models.Model):
    cbu = models.CharField(max_length=22, unique=True)
    cuenta = models.OneToOneField(
        Cuenta,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="cuenta_vinculada",
    )

    def __str__(self):
        return f"Cuenta vinculada {self.cbu}"


class Movimiento(models.Model):
    class Tipo(models.TextChoices):
        DEBITO = "debito", "Débito"
        CREDITO = "credito", "Crédito"
        TRANSFERENCIA = "transferencia", "Transferencia"

    monto = models.DecimalField(max_digits=12, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(
        max_length=20,
        choices=Tipo.choices,
    )
    comprobante = models.FileField(
        upload_to="comprobantes/movimientos/",
        null=True,
        blank=True,
    )

    cuenta = models.ForeignKey(
        Cuenta,
        on_delete=models.CASCADE,
        related_name="movimientos",
    )

    def __str__(self):
        return f"Movimiento #{self.id} - {self.tipo}"
