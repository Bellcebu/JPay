from decimal import Decimal


CREDIT_RATE_TABLE = [
    {"min": 800, "max": 900, "tna": Decimal("45.00")},   # riesgo muy bajo
    {"min": 700, "max": 799, "tna": Decimal("60.00")},   # bueno
    {"min": 600, "max": 699, "tna": Decimal("80.00")},   # medio
    {"min": 500, "max": 599, "tna": Decimal("110.00")},  # alto
    {"min":   0, "max": 499, "tna": Decimal("150.00")},  # muy alto
]


def obtener_tna_por_score(score: int) -> Decimal:
    """
    Map credit score → interest rate (TNA).
    Uses a risk-tier table (industry standard).
    """
    for tier in CREDIT_RATE_TABLE:
        if tier["min"] <= score <= tier["max"]:
            return tier["tna"]
    raise ValueError(f"Score fuera de rango: {score}")