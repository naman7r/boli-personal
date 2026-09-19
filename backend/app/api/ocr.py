"""POST /ocr — a photographed Hindi textbook line to text, via Tesseract."""

import io
import os
import re
import shutil
from functools import lru_cache

import pytesseract
from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

router = APIRouter()

LANG = "hin+eng"
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
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(400, f"Could not read uploaded file: {e}")

    filename = (file.filename or "").lower()
    images = []

    # Support PDF files directly in /ocr via pypdfium2 rasterization
    if filename.endswith(".pdf") or file_bytes.startswith(b"%PDF"):
        try:
            import pypdfium2 as pdfium

            doc = pdfium.PdfDocument(file_bytes)
            for page in doc:
                images.append(page.render(scale=2.5).to_pil())
        except Exception as e:
            raise HTTPException(400, f"Could not parse uploaded PDF for OCR: {e}")
    else:
        try:
            images.append(Image.open(io.BytesIO(file_bytes)))
        except Exception as e:
            raise HTTPException(400, f"The uploaded file is not a valid image: {e}")

    all_words = []
    all_confidences = []

    for img in images:
        try:
            data = pytesseract.image_to_data(
                img, lang=LANG, output_type=pytesseract.Output.DICT
            )
        except pytesseract.TesseractNotFoundError:
            raise HTTPException(
                500,
                "Tesseract is not installed or not on PATH. Install it with the Hindi "
                "('hin') language pack, or set TESSERACT_CMD in backend/.env.",
            )
        except pytesseract.TesseractError as e:
            # Fallback to hin if hin+eng is missing eng
            try:
                data = pytesseract.image_to_data(
                    img, lang="hin", output_type=pytesseract.Output.DICT
                )
            except Exception as e2:
                raise HTTPException(
                    500, f"Tesseract failed to read image. Is 'hin' pack installed? Error: {e2}"
                )

        for text, conf in zip(data.get("text", []), data.get("conf", [])):
            t = text.strip()
            if t:
                # Clean any stray CID references
                cleaned_t = re.sub(r"\(cid:\d+\)", "", t).strip()
                if cleaned_t:
                    all_words.append(cleaned_t)
                    try:
                        c = float(conf)
                        if c >= 0:
                            all_confidences.append(c)
                    except (ValueError, TypeError):
                        pass

    full_text = " ".join(all_words)
    mean_conf = sum(all_confidences) / len(all_confidences) if all_confidences else 0.0
    confidence_flag = "low" if mean_conf < LOW_CONFIDENCE_BELOW else "normal"

    return {
        "text": full_text,
        "confidence": confidence_flag,
        "raw_confidence": round(mean_conf, 1),
    }
