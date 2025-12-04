from decimal import Decimal, ROUND_HALF_UP


# Tabla de riesgo → TNA
CREDIT_RATE_TABLE = [
    {"min": 800, "max": 900, "tna": Decimal("45.00")},   # riesgo muy bajo
    {"min": 700, "max": 799, "tna": Decimal("60.00")},   # bueno
    {"min": 600, "max": 699, "tna": Decimal("80.00")},   # medio
    {"min": 500, "max": 599, "tna": Decimal("110.00")},  # alto
    {"min":   0, "max": 499, "tna": Decimal("150.00")},  # muy alto
]


def obtener_tna_por_score(score: int | None) -> Decimal:
    """
    Asigna TNA según score usando la tabla CREDIT_RATE_TABLE.

    Si score es None → riesgo desconocido → riesgo muy alto (150%).
    """
    if score is None:
        return Decimal("150.00")

    for tier in CREDIT_RATE_TABLE:
        if tier["min"] <= score <= tier["max"]:
            return tier["tna"]

    raise ValueError(f"Score fuera de rango: {score}")


class InteresService:

    @staticmethod
    def calcular_intereses(prestamo):
        """
        Calcula:
        - TNA (según scoring)
        - TEP (tasa efectiva periódica mensual)
        - CFT (costo financiero total simplificado)

        Devuelve: (tna, tep, cft)
        """

        user = prestamo.usuario
        score = user.score if user.score is not None else None

        # 1) TNA basada en score
        tna = obtener_tna_por_score(score)

        # 2) Convertir TNA a TEP
        # Formula: TEP = (TNA/100) / 12
        mensual = (tna / Decimal("100")) / Decimal("12")
        tep = mensual * Decimal("100")
        tep = InteresService._round2(tep)

        # 3) CFT (simplificado)
        # Puede incluir cargos administrativos, IVA, seguros, etc.
        # Por ahora: CFT = TNA + 25%
        cft = tna + Decimal("25.00")
        cft = InteresService._round2(cft)

        return tna, tep, cft

    @staticmethod
    def _round2(value):
        return Decimal(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)