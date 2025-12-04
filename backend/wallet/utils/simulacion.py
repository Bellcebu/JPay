from decimal import Decimal, ROUND_HALF_UP


def _round2(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def simular_prestamo(monto: Decimal, tna: Decimal, plazo_meses: int, sistema: str):
    monto = Decimal(monto)
    tna = Decimal(tna)
    n = int(plazo_meses)

    # Monthly rate
    i = (tna / Decimal("100")) / Decimal("12")
    i = i if i != 0 else Decimal("0")

    cuotas = []
    saldo = monto  # internal precise saldo
    total_intereses = Decimal("0.00")
    total_pagado = Decimal("0.00")

    sistema = sistema.lower()

    # Helper: rounded display
    def r(x):
        return _round2(Decimal(x))

    if sistema == "frances":
        # cuota fija exacta
        if i == 0:
            cuota_fija = monto / n
        else:
            factor = (1 + i) ** n
            cuota_fija = monto * i * factor / (factor - 1)

        cuota_fija = r(cuota_fija)

        for k in range(1, n + 1):
            saldo_inicio = r(saldo)

            interes = r(saldo_inicio * i)

            # Capital normal except last period
            if k < n:
                capital = r(cuota_fija - interes)
            else:
                # Last installment: absorb exact remaining balance
                capital = saldo_inicio
                cuota_fija = r(capital + interes)

            saldo = saldo - capital  # internal precise

            total_intereses += interes
            total_pagado += cuota_fija

            cuotas.append({
                "numero": k,
                "cuota": cuota_fija,
                "capital": capital,
                "interes": interes,
                "saldo": saldo_inicio
            })

    elif sistema == "aleman":
        amortizacion_constante = r(monto / n)

        for k in range(1, n + 1):
            saldo_inicio = r(saldo)

            interes = r(saldo_inicio * i)

            if k < n:
                capital = amortizacion_constante
            else:
                capital = saldo_inicio  # absorb exact remainder

            cuota = r(capital + interes)

            saldo = saldo - capital

            total_intereses += interes
            total_pagado += cuota

            cuotas.append({
                "numero": k,
                "cuota": cuota,
                "capital": capital,
                "interes": interes,
                "saldo": saldo_inicio
            })

    elif sistema == "americano":
        for k in range(1, n + 1):
            saldo_inicio = r(saldo)
            interes = r(saldo_inicio * i)

            if k < n:
                capital = Decimal("0.00")
                cuota = interes
            else:
                capital = saldo_inicio  # all principal at the end
                cuota = r(interes + capital)

            saldo = saldo - capital

            total_intereses += interes
            total_pagado += cuota

            cuotas.append({
                "numero": k,
                "cuota": cuota,
                "capital": capital,
                "interes": interes,
                "saldo": saldo_inicio
            })

    else:
        raise ValueError("Sistema no soportado")

    total_intereses = r(total_intereses)
    total_pagado = r(total_pagado)

    return cuotas, total_intereses, total_pagado
