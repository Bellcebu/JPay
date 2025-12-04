from wallet.models import Notificacion, Usuario


class NotificationService:

    @staticmethod
    def notificar_envio(usuario: Usuario, monto, alias_destino):
        return Notificacion.objects.create(
            usuario=usuario,
            titulo="Transferencia enviada",
            cuerpo=f"Enviaste ${monto} a {alias_destino}.",
            prioridad=Notificacion.Prioridad.MEDIA,
            tipo=Notificacion.Tipo.ALERTA,
        )

    @staticmethod
    def notificar_recepcion(usuario: Usuario, monto, alias_origen):
        return Notificacion.objects.create(
            usuario=usuario,
            titulo="Transferencia recibida",
            cuerpo=f"Recibiste ${monto} de {alias_origen}.",
            prioridad=Notificacion.Prioridad.ALTA,
            tipo=Notificacion.Tipo.PAGO,
        )
