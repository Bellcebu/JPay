# wallet/qr_utils.py
import base64
import uuid
from dataclasses import dataclass
from decimal import Decimal
from typing import Optional


@dataclass
class QRPaymentData:
    version: int
    intent_id: str
    cuenta_destino_identifier: str
    monto: Optional[Decimal]
    moneda: str
    descripcion: str


def encode_qr_payload(data: QRPaymentData) -> str:
    raw = (
        f"JPAY|v={data.version}"
        f"|id={data.intent_id}"
        f"|acc={data.cuenta_destino_identifier}"
        f"|amt={data.monto if data.monto is not None else ''}"
        f"|cur={data.moneda}"
        f"|desc={data.descripcion}"
    )
    return base64.urlsafe_b64encode(raw.encode("utf-8")).decode("utf-8")


def decode_qr_payload(payload: str) -> QRPaymentData:
    try:
        raw = base64.urlsafe_b64decode(payload.encode("utf-8")).decode("utf-8")
    except Exception as exc:
        raise ValueError("Invalid QR payload encoding.") from exc

    parts = raw.split("|")
    if not parts or parts[0] != "JPAY":
        raise ValueError("QR payload not recognized as JPay format.")

    data = {}
    for part in parts[1:]:
        if "=" not in part:
            continue
        k, v = part.split("=", 1)
        data[k] = v

    try:
        version = int(data.get("v", "1"))
        intent_id = data["id"]
        cuenta_identifier = data["acc"]
        moneda = data.get("cur", "ARS")
        desc = data.get("desc", "")
        amt_raw = data.get("amt", "")
        monto = Decimal(amt_raw) if amt_raw else None
    except KeyError as exc:
        raise ValueError("Missing required field in QR payload.") from exc
    except Exception as exc:
        raise ValueError("Invalid numeric field in QR payload.") from exc

    return QRPaymentData(
        version=version,
        intent_id=intent_id,
        cuenta_destino_identifier=cuenta_identifier,
        monto=monto,
        moneda=moneda,
        descripcion=desc,
    )
