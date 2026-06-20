import logging
from typing import Generator
from sqlalchemy.exc import IntegrityError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_token
from app.core.security import get_password_hash
from app.db.crud.user import get_user_by_username
from app.db.models.user import User as UserModel
from app.db.schemas.user import TokenData

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

GUEST_USERNAME = "guest"
GUEST_EMAIL = "guest@researchcopilot.local"
GUEST_FULL_NAME = "Research Copilot Guest"
GUEST_PASSWORD = "research-copilot-guest"

def _guest_user_stub() -> UserModel:
    return UserModel(
        id=0,
        username=GUEST_USERNAME,
        email=GUEST_EMAIL,
        full_name=GUEST_FULL_NAME,
        hashed_password="",
        is_active=True,
        is_superuser=False,
    )

async def get_db_session() -> Generator:
    async for session in get_db():
        yield session

async def get_guest_user(db: AsyncSession) -> UserModel:
    try:
        existing = await get_user_by_username(db, username=GUEST_USERNAME)
        if existing:
            return existing

        guest_user = UserModel(
            username=GUEST_USERNAME,
            email=GUEST_EMAIL,
            full_name=GUEST_FULL_NAME,
            hashed_password=get_password_hash(GUEST_PASSWORD),
            is_active=True,
            is_superuser=False,
        )

        db.add(guest_user)
        await db.commit()
        await db.refresh(guest_user)
        return guest_user
    except (IntegrityError, Exception) as exc:
        logger.warning("Falling back to transient guest user: %s", exc)
        try:
            await db.rollback()
        except Exception:
            pass
        return _guest_user_stub()

async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db_session)
) -> UserModel:
    if not token:
        return await get_guest_user(db)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    user = await get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: UserModel = Depends(get_current_user),
) -> UserModel:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
