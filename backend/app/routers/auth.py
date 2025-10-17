from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from algosdk import encoding
from nacl.signing import VerifyKey
import base64


router = APIRouter(prefix="/api/auth", tags=["auth"])


class ChallengeResponse(BaseModel):
    message_to_sign: str
    nonce: str


class VerifyRequest(BaseModel):
    address: str
    signature_b64: str
    nonce: str


@router.get("/challenge", response_model=ChallengeResponse)
def get_challenge() -> ChallengeResponse:
    # In production, store nonce server-side and bind to session/user/ip
    from secrets import token_urlsafe

    nonce = token_urlsafe(16)
    message = f"HosConnect login nonce: {nonce}"
    return ChallengeResponse(message_to_sign=message, nonce=nonce)


@router.post("/verify")
def verify_signature(payload: VerifyRequest) -> dict:
    # Verify an ed25519 signature where message is "HosConnect login nonce: {nonce}"
    try:
        message = f"HosConnect login nonce: {payload.nonce}".encode()
        signature = base64.b64decode(payload.signature_b64)
        pubkey_bytes = encoding.decode_address(payload.address)
        VerifyKey(pubkey_bytes).verify(message, signature)
        return {"ok": True}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid signature")


