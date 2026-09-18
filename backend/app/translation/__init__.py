"""Multilingual translation module for BOLI."""

import os
from .router import TranslationRouter, get_router, detect_source_language, normalize_code
from .validation import validate_script, contains_meetei_mayek
from .segmentation import segment_text, reconstruct_text

SUPPORTED_TARGETS = (
    "sat", "sat_Olck",
    "kru", "kru_Deva",
    "unr", "unr_Deva",
    "sck", "sck_Deva",
    "hoc", "hoc_Deva",
    "hin", "hin_Deva", "hi",
    "eng", "eng_Latn", "en",
    "bho", "bho_Deva",
    "mag", "mag_Deva",
    "mai", "mai_Deva",
    "ben", "ben_Beng",
    "ory", "ory_Orya",
)


def warmup():
    """Warm up translation models at startup."""
    try:
        router = get_router()
        if os.getenv("HF_TOKEN"):
            router.indictrans.translate_sentences(["नमस्ते"], "hin_Deva", "sat_Olck")
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning("Translation warmup skipped: %s", e)


def translate_detailed(text: str, target: str = "sat_Olck", source: str | None = None) -> dict:
    """Translate text and return full routing and verification metadata."""
    router = get_router()
    return router.translate(text, target=target, source=source)


def translate(text: str, target: str = "sat_Olck", source: str | None = None) -> str:
    """Translate text returning the translated string."""
    res = translate_detailed(text, target=target, source=source)
    if not res.get("translated"):
        raise RuntimeError(f"Translation came back empty for target '{target}'.")
    return res["translated"]


__all__ = [
    "TranslationRouter",
    "get_router",
    "SUPPORTED_TARGETS",
    "contains_meetei_mayek",
    "validate_script",
    "translate_detailed",
    "translate",
    "warmup",
    "detect_source_language",
    "normalize_code",
]
