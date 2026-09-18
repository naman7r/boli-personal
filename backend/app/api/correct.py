"""POST /correct, GET /corrections/count — teacher corrections."""

from contextlib import closing

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db import db
from app.api.languages import NAMES

router = APIRouter()


class CorrectionRequest(BaseModel):
    lesson_id: int
    original: str
    corrected: str
    lang: str


@router.post("/correct")
def correct(req: CorrectionRequest):
    if req.lang not in NAMES:
        raise HTTPException(
            400, f"Unknown language '{req.lang}'. See GET /languages."
        )
    if not req.corrected.strip():
        raise HTTPException(400, "The corrected text is empty.")

    with closing(db.connect()) as conn:
        cur = conn.execute(
            "INSERT INTO corrections (lesson_id, lang_code, original_text, "
            "corrected_text) VALUES (?, ?, ?, ?)",
            (req.lesson_id, req.lang, req.original, req.corrected.strip()),
        )
        conn.commit()
        return {"id": cur.lastrowid, "logged": True}


@router.get("/corrections/count")
def corrections_count():
    with closing(db.connect()) as conn:
        (count,) = conn.execute("SELECT COUNT(*) FROM corrections").fetchone()
    return {"count": count}
