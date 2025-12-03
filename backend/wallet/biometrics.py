from dataclasses import dataclass
from typing import Optional, Protocol


@dataclass
class BiometricResult:
    success: bool
    score: Optional[float] = None
    reason: str = ""


class BiometricProvider(Protocol):
    def verify(
        self,
        usuario_id: int,
        device_id: str | None,
        sample: str,
    ) -> BiometricResult:  # pragma: no cover - protocol/interface
        ...


class DummyBiometricProvider:
    """
    Simulación de un proveedor biométrico.

    Reglas de ejemplo (para dev):
    - sample == "ok"  -> éxito alto
    - sample == "fail" -> falla
    - cualquier otra cosa -> éxito medio
    """

    def verify(
        self,
        usuario_id: int,
        device_id: str | None,
        sample: str,
    ) -> BiometricResult:
        sample_normalized = (sample or "").strip().lower()

        if sample_normalized == "fail":
            return BiometricResult(
                success=False,
                score=0.0,
                reason="Dummy provider: forced failure (sample='fail').",
            )
        elif sample_normalized == "ok":
            return BiometricResult(
                success=True,
                score=0.99,
                reason="Dummy provider: strong match (sample='ok').",
            )
        else:
            return BiometricResult(
                success=True,
                score=0.75,
                reason="Dummy provider: default simulated match.",
            )


def get_biometric_provider() -> BiometricProvider:
    """
    Punto único para obtener el proveedor biométrico.
    En el futuro podés leer de settings, env vars, etc.
    """
    # Ejemplo futuro:
    # from django.conf import settings
    # if settings.BIOMETRIC_PROVIDER == "real_vendor":
    #     return RealVendorBiometricProvider(...)
    return DummyBiometricProvider()