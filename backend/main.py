"""Top-level backend entrypoint for BOLI personal repository."""

import sys
from pathlib import Path

# Ensure backend directory is on sys.path
_BACKEND_DIR = Path(__file__).resolve().parent
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))

from app.main import app

__all__ = ["app"]
