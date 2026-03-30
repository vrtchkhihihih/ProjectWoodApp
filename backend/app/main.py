from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError

from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.init_db import seed_catalog
from app.db.session import SessionLocal, engine


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)

legacy_dir = Path(__file__).resolve().parents[2] / "site"
if legacy_dir.exists():
    app.mount("/legacy", StaticFiles(directory=legacy_dir), name="legacy")


@app.on_event("startup")
def on_startup() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            seed_catalog(db)
    except SQLAlchemyError:
        # MySQL may be unavailable during early migration stages.
        pass


@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    return {"message": "Wood App API is running"}
