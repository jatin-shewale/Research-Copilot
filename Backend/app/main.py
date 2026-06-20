import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import papers, search, graphs, chat, analytics, auth
from app.core.database import init_db

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Research Copilot",
    description="Intelligent Scientific Literature Exploration Platform",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(papers.router, prefix=f"{settings.API_V1_STR}/papers", tags=["papers"])
app.include_router(search.router, prefix=f"{settings.API_V1_STR}/search", tags=["search"])
app.include_router(graphs.router, prefix=f"{settings.API_V1_STR}/graphs", tags=["graphs"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])


@app.on_event("startup")
async def ensure_database_schema() -> None:
    try:
        await init_db()
    except Exception as exc:
        logger.warning("Database schema initialization skipped: %s", exc)

@app.get("/")
async def root():
    return {"message": "Welcome to Research Copilot"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
