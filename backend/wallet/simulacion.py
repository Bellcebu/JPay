from decimal import Decimal, ROUND_HALF_UP


def _round2(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def simular_prestamo(monto: Decimal, tna: Decimal, plazo_meses: int, sistema: str):
    monto = Decimal(monto)
    tna = Decimal(tna)
    n = int(plazo_meses)

    i = (tna / Decimal("100")) / Decimal("12")
    i = i if i != 0 else Decimal("0")

    cuotas = []
    saldo = monto
    total_intereses = Decimal("0.00")
    total_pagado = Decimal("0.00")

    sistema = sistema.lower()

    if sistema == "frances":
        if i == 0:
            cuota_fija = monto / n
        else:
            factor = (Decimal("1") + i) ** n
            cuota_fija = monto * i * factor / (factor - Decimal("1"))
        cuota_fija = _round2(cuota_fija)

        for k in range(1, n + 1):
            interes = _round2(saldo * i)
            capital = _round2(cuota_fija - interes)
            saldo = _round2(saldo - capital)
            if saldo < 0:
                saldo = Decimal("0.00")

            total_intereses += interes
            total_pagado += cuota_fija

            cuotas.append(
                {
                    "numero": k,
                    "cuota": cuota_fija,
                    "capital": capital,
                    "interes": interes,
                    "saldo": saldo,
                }
            )

    elif sistema == "aleman":
        amortizacion_constante = _round2(monto / n)

        for k in range(1, n + 1):
            interes = _round2(saldo * i)
            cuota = _round2(amortizacion_constante + interes)
            capital = amortizacion_constante
            saldo = _round2(saldo - capital)
            if saldo < 0:
                saldo = Decimal("0.00")

            total_intereses += interes
            total_pagado += cuota

            cuotas.append(
                {
                    "numero": k,
                    "cuota": cuota,
                    "capital": capital,
                    "interes": interes,
                    "saldo": saldo,
                }
            )

    elif sistema == "americano":
        for k in range(1, n + 1):
            interes = _round2(saldo * i)
            if k < n:
                capital = Decimal("0.00")
                cuota = interes
                nuevo_saldo = saldo
            else:
                capital = saldo
                cuota = _round2(interes + capital)
                nuevo_saldo = Decimal("0.00")

            total_intereses += interes
            total_pagado += cuota

            cuotas.append(
                {
                    "numero": k,
                    "cuota": cuota,
                    "capital": capital,
                    "interes": interes,
                    "saldo": nuevo_saldo,
                }
            )
            saldo = nuevo_saldo

    else:
        raise ValueError("Sistema de amortización no soportado")

    total_intereses = _round2(total_intereses)
    total_pagado = _round2(total_pagado)

    return cuotas, total_intereses, total_pagado
