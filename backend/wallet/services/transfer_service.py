from decimal import Decimal
from django.db import transaction
from wallet.models import Cuenta, Movimiento
from wallet.services.pdf_service import PDFComprobanteService
import uuid

class TransferService:

    @staticmethod
    @transaction.atomic
    def realizar_transferencia(cuenta_origen, cuenta_destino, monto):
        if monto <= 0:
            raise ValueError("El monto debe ser mayor a 0.")

        if cuenta_origen.saldo < monto:
            raise ValueError("Saldo insuficiente.")

        referencia = str(uuid.uuid4())

        # Update balances
        cuenta_origen.saldo -= monto
        cuenta_origen.save()

        cuenta_destino.saldo += monto
        cuenta_destino.save()

        # Create debit movement
        movimiento_debito = Movimiento.objects.create(
            cuenta=cuenta_origen,
            tipo=Movimiento.Tipo.DEBITO,
            monto=monto,
            referencia=referencia,
            descripcion=f"Transferencia a {cuenta_destino.alias}",
        )

        # Create credit movement
        movimiento_credito = Movimiento.objects.create(
            cuenta=cuenta_destino,
            tipo=Movimiento.Tipo.CREDITO,
            monto=monto,
            referencia=referencia,
            descripcion=f"Transferencia de {cuenta_origen.alias}",
        )

        # Generate PDF for debit movement only
        PDFComprobanteService.generar_pdf_transferencia(
            movimiento_debito,
            movimiento_credito
        )

        return referencia
