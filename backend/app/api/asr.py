"""POST /asr — Hindi speech to text via Meta MMS ASR."""

import logging
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.speech import asr

router = APIRouter()
log = logging.getLogger(__name__)


@router.post("/asr")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe spoken Hindi audio into Hindi text."""
    try:
        audio_bytes = await file.read()
    except Exception as e:
        raise HTTPException(400, f"Could not read audio file: {e}")

    if not audio_bytes:
        raise HTTPException(400, "The audio file was empty.")

    try:
        text = asr.transcribe(audio_bytes)
        return {"text": text}
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        log.exception("/asr transcription failed: %s", e)
        raise HTTPException(502, f"ASR transcription failed: {e}")
