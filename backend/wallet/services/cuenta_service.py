from decimal import Decimal
from wallet.models import Cuenta
import random

class CuentaService:

    @staticmethod
    def generar_cvu():
        return int("3" + "".join(str(random.randint(0,9)) for _ in range(21)))

    @staticmethod
    def generar_alias(usuario):
        base = f"{usuario.first_name.lower()}.{usuario.last_name.lower()}"
        # Add some randomness to avoid collisions
        suffix = random.randint(1000, 9999)
        return f"{base.replace(' ', '')}.{suffix}.jpay"

    @staticmethod
    def crear_cuenta_para_usuario(usuario):
        cvu = CuentaService.generar_cvu()
        alias = CuentaService.generar_alias(usuario)

        cuenta = Cuenta.objects.create(
            usuario=usuario,
            cvu=cvu,
            alias=alias,
            saldo=Decimal("1000.00"),
        )

        return cuenta