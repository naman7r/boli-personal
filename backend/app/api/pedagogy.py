"""POST /simplify — Hindi in, simpler Hindi out."""

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core import pedagogy

router = APIRouter()
log = logging.getLogger(__name__)


class SimplifyRequest(BaseModel):
    text: str
    grade: int = 2
    fallback: bool = False


@router.post("/simplify")
def simplify(req: SimplifyRequest):
    try:
        return pedagogy.simplify(req.text, grade=req.grade, allow_fallback=req.fallback)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except RuntimeError as e:
        log.exception("/simplify failed: %s", e)
        raise HTTPException(502, str(e))
