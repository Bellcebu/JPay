from django.db import models

class Usuario(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "pediente"
        VERIFICADO = "verificado"
        BLOQUEDO = "bloqueado"


    nombre = models.CharField()
    apellido = models.char()
    dni = models.BigIntegerField()
    fecha_nacimiento = models.DateField()
    telefono = models.BigIntegerField()
    email = models.EmailField()
    estado_verificacion = models.CharField(choices=Estado.choices, default=Estado.PENDIENTE)
    score = models.FloatField(null= True)


class SolicitudPrestamo(models.Model):
    monto_solicitado = models.FloatField()
    plazo_meses = models.IntegerField()
    is_aprobado = models.BooleanField(default= False)
    motivo_de_rechazo = models.CharField(null= True, default= None)
    creado_en = models.DateField(auto_now_add= True)

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE) #nose si hago null=true para que sea opcional para el usuario

class Sesion(models.Model):
    dispositivo = models.CharField(max_length= 100)
    ip = models.CharField(max_length=20)
    creado_en = models.DateField(auto_now_add=True)
    expirada_en = models.DateField(null=True)
    ultima_actividad = models.DateField(auto_now_add=True)
    is_activa = models.BooleanField(default= True)

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Prestamo(models.Model):
    class Estado(models.TextChoices):
        APROBADO = "aprobado"
        DESEMBOLSADO = "desembolsado"
        CANCELADO = "cancelado"
        MORA = "mora"


    monto = models.FloatField()
    plazo_meses = models.IntegerField()
    tep = models.FloatField()
    cft = models.FloatField()
    tna = models.FloatField()
    estado = models.CharField(choices=Estado.choices, default=Estado.APROBADO)

    ultima_refinanciacion = models.DateField(null=True)
    fecha_desembolso = models.DateField(null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.RESTRICT)
    solicitud_prestamo = models.OneToOneField(SolicitudPrestamo, null=True)

class Cuota(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "pendiente"
        PAGADA = "pagada"
        VENCIDA = "vencida"

    fecha_vencimiento = models.DateField()
    capital = models.FloatField()
    interes = models.FloatField()
    impuestos = models.FloatField()
    saldo_cuota = models.FloatField()
    estado = models.CharField(choices=Estado.choices, default=Estado.PENDIENTE)

    prestamo = models.ForeignKey(Prestamo, on_delete=models.CASCADE)

class Pago(models.Model):
    importe = models.FloatField()
    fecha_pago = models.DateField(auto_now_add=True)
    comprobante = models.FileField()

    cuota = models.OneToOneField(Cuota, null=True, on_delete=models.CASCADE)

class Notificacion(models.Model):
    class Tipo(models.TextChoices):
        VENCICMIENTO = "vencimiento"
        PAGO = "pago"
        APROBACION = "aprobacion"
        RECHAZO = "rechazo"
        CAMBIO_PERFIL = "cambio_perfil"
        ALERTA = "alerto"
    
    class Prioridad(models.TextChoices):
        BAJA = "baja"
        MEDIA = "media"
        ALTA = "alta"

    titulo = models.CharField()
    cuerpo = models.TextField()
    prioridad = models.CharField(choices=Prioridad.choices)
    tipo = models.CharField(choices=Tipo.choices)
    creado_en = models.DateTimeField(auto_now_add=True)
    leida = models.BooleanField(default=False)

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Cuenta(models.Model):
    class EstadoVerificacion(models.TextChoices):
        PENDIENTE = "pediente"
        VERIFICADO = "verificado"
        BLOQUEDA = "bloqueada"


    estado_verificacion = models.CharField(choices=EstadoVerificacion.choices, default=EstadoVerificacion.PENDIENTE)
    cvu = models.BigIntegerField(unique=True)
    saldo = models.FloatField()
    alias = models.CharField()

    usuario = models.OneToOneField(Usuario, null=True, on_delete=models.CASCADE)

class Cuenta_vinculada(models.Model):
    cbu = models.BigIntegerField(unique=True)
    cuenta = models.OneToOneField(Cuenta, on_delete=models.CASCADE, null=True)




class Moviento(models.Model):
    class Tipo(models.TextChoices):
        DEBITO = "debito"
        CREDITO = "credito"
        TRANSFERENCIA = "transferencia"

    monto = models.FloatField()
    creado_en = models.DateField(auto_now_add=True)
    tipo = models.CharField(choices=Tipo.choices)
    #estado
    comprobante = models.FileField()

    cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE)
