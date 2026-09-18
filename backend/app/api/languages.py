"""GET /languages — dynamic capability list for the 5 supported languages."""

from fastapi import APIRouter
from app.core import phrase_bank
from app.translation import SUPPORTED_TARGETS
from app.speech import tts

router = APIRouter()

NAMES = {
    "sat": "Santali",
    "hoc": "Ho",
    "unr": "Mundari",
    "kru": "Kurukh",
    "sck": "Sadri",
}

NOTES = {
    "sat": "AI4Bharat IndicTrans2 Neural MT & Indic Parler-TTS (Arjun / Pushpa voices).",
    "hoc": "North Munda Linguistic Transfer Engine & Meta MMS-TTS.",
    "unr": "North Munda Linguistic Transfer Engine & Meta MMS-TTS.",
    "kru": "mT5 Neural Translation & Meta MMS-TTS.",
    "sck": "Sadri Morphological Transfer Engine & Meta MMS-TTS.",
}

_TRANSLATABLE = {t.split("_")[0] for t in SUPPORTED_TARGETS}


def _capability(code: str) -> dict:
    if code in _TRANSLATABLE:
        translation_cap = "full"
    elif code in phrase_bank.LANGS:
        translation_cap = "phrase_bank"
    else:
        translation_cap = "none"

    return {
        "code": code,
        "name": NAMES[code],
        "translation": translation_cap,
        "tts": "full" if code in tts.MODELS else "none",
        "note": NOTES[code],
    }


@router.get("/languages")
def languages():
    return [_capability(code) for code in NAMES]
