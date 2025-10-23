from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routers import auth, medical


def create_app() -> FastAPI:
    app = FastAPI(title="Medical Connect API", version="1.0.0")

    allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(medical.router)

    @app.get("/health")
    def health_check() -> dict:
        return {"status": "ok", "service": "Medical Connect API"}

    @app.get("/")
    def root() -> dict:
        return {
            "message": "Medical Connect API",
            "version": "1.0.0",
            "docs": "/docs"
        }

    return app


app = create_app()


