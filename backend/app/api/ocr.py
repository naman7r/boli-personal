"""POST /ocr — a photographed Hindi textbook line to text, via Tesseract."""

import io
import os
import shutil
from functools import lru_cache

import pytesseract
from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

router = APIRouter()

LANG = "hin"
LOW_CONFIDENCE_BELOW = 70

_WINDOWS_DEFAULT = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
_MACOS_DEFAULTS = ("/opt/homebrew/bin/tesseract", "/usr/local/bin/tesseract")


@lru_cache(maxsize=1)
def _binary() -> str:
    """Env override, then PATH, then macOS Homebrew and Windows default locations."""
    candidates = [
        os.getenv("TESSERACT_CMD"),
        shutil.which("tesseract"),
        *_MACOS_DEFAULTS,
    ]
    for candidate in candidates:
        if candidate and (os.path.exists(candidate) or shutil.which(candidate)):
            return candidate
    if os.path.exists(_WINDOWS_DEFAULT):
        return _WINDOWS_DEFAULT
    raise RuntimeError(
        "Tesseract is not installed or not on PATH. Install it with the Hindi "
        "('hin') language pack, or set TESSERACT_CMD in backend/.env."
    )


@router.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    pytesseract.pytesseract.tesseract_cmd = _binary()
    try:
        image = Image.open(io.BytesIO(await file.read()))
    except Exception as e:
        raise HTTPException(400, f"The uploaded file is not a valid image: {e}")

    try:
        data = pytesseract.image_to_data(
            image, lang=LANG, output_type=pytesseract.Output.DICT
        )
    except pytesseract.TesseractNotFoundError:
        raise HTTPException(
            500,
            "Tesseract is not installed or not on PATH. Install it with the Hindi "
            "('hin') language pack, or set TESSERACT_CMD in backend/.env.",
        )
    except pytesseract.TesseractError as e:
        raise HTTPException(
            500, f"Tesseract failed to read image. Is 'hin' pack installed? Error: {e}"
        )

    words = []
    confidences = []
    for text, conf in zip(data["text"], data["conf"]):
        t = text.strip()
        if t:
            words.append(t)
            try:
                c = float(conf)
                if c >= 0:
                    confidences.append(c)
            except (ValueError, TypeError):
                pass

    full_text = " ".join(words)
    mean_conf = sum(confidences) / len(confidences) if confidences else 0.0
    confidence_flag = "low" if mean_conf < LOW_CONFIDENCE_BELOW else "normal"

    return {
        "text": full_text,
        "confidence": confidence_flag,
        "raw_confidence": round(mean_conf, 1),
    }
