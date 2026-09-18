"""SQLite connection helpers for BOLI personal repository."""

import os
import sqlite3
from pathlib import Path

_HERE = Path(__file__).resolve().parent          # backend/app/db
_BACKEND_ROOT = _HERE.parent.parent              # backend
_SCHEMA = _HERE / "schema.sql"
DEFAULT_PATH = _HERE / "boli.sqlite"


def path() -> Path:
    """Where the database lives, independent of the working directory."""
    configured = os.getenv("DATABASE_PATH")
    if not configured:
        return DEFAULT_PATH
    configured = Path(configured)
    return configured if configured.is_absolute() else _BACKEND_ROOT / configured


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(path())
    conn.row_factory = sqlite3.Row
    return conn


def init() -> None:
    """Create the tables if they are missing. Safe to run on every boot."""
    path().parent.mkdir(parents=True, exist_ok=True)
    conn = connect()
    try:
        conn.executescript(_SCHEMA.read_text(encoding="utf-8"))
        conn.commit()
    finally:
        conn.close()
