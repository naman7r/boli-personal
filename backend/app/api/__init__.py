"""BOLI API routes registration."""

from fastapi import APIRouter
from . import translate, speak, asr, chapter, pedagogy, correct, languages, lessons, ocr

api_router = APIRouter()
api_router.include_router(translate.router)
api_router.include_router(speak.router)
api_router.include_router(asr.router)
api_router.include_router(chapter.router)
api_router.include_router(pedagogy.router)
api_router.include_router(correct.router)
api_router.include_router(languages.router)
api_router.include_router(lessons.router)
api_router.include_router(ocr.router)

__all__ = ["api_router"]
