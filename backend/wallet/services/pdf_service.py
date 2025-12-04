from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from django.core.files.base import ContentFile
from django.utils.timezone import now


class PDFComprobanteService:

    @staticmethod
    def generar_pdf_transferencia(movimiento, movimiento_opuesto):
        """
        Creates a PDF receipt for the debit movement of a transfer.
        movimiento = debit movement
        movimiento_opuesto = credit movement
        """

        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)

        width, height = A4

        # Header
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 80, "Comprobante de Transferencia - JPay")

        # Reference
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 130, f"Referencia: {movimiento.referencia}")
        c.drawString(50, height - 150, f"Fecha: {movimiento.creado_en.strftime('%d/%m/%Y %H:%M')}")

        # Sender
        c.drawString(50, height - 190, "Origen:")
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, height - 210, f"{movimiento.cuenta.usuario.first_name} {movimiento.cuenta.usuario.last_name}")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 230, f"Alias: {movimiento.cuenta.alias}")
        c.drawString(50, height - 250, f"CVU: {movimiento.cuenta.cvu}")

        # Receiver
        destino = movimiento_opuesto.cuenta

        c.drawString(50, height - 290, "Destino:")
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, height - 310, f"{destino.usuario.first_name} {destino.usuario.last_name}")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 330, f"Alias: {destino.alias}")
        c.drawString(50, height - 350, f"CVU: {destino.cvu}")

        # Amount
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, height - 400, f"Monto transferido: ${movimiento.monto}")

        c.setFont("Helvetica", 10)
        c.drawString(50, height - 450, "Este comprobante fue generado automáticamente por JPay.")

        c.showPage()
        c.save()

        pdf_content = buffer.getvalue()
        buffer.close()

        filename = f"comprobante_{movimiento.referencia}.pdf"

        movimiento.comprobante.save(filename, ContentFile(pdf_content), save=True)

        return movimiento.comprobante.url

