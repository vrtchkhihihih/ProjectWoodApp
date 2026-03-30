from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, UserLogin, UserRead, UserRegister, UserUpdate
from app.services.security import hash_password, verify_password


router = APIRouter()


def _serialize_user(user: User) -> UserRead:
    return UserRead.model_validate(user)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegister, db: Session = Depends(get_db)) -> AuthResponse:
    existing = db.execute(select(User).where(User.email == payload.email.lower())).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        phone=(payload.phone or "").strip() or None,
        password_hash=hash_password(payload.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthResponse(user=_serialize_user(user), message="Аккаунт создан")


@router.post("/login", response_model=AuthResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.execute(select(User).where(User.email == payload.email.lower())).scalars().first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")
    return AuthResponse(user=_serialize_user(user), message="Вход выполнен")


@router.get("/users", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db)) -> list[UserRead]:
    users = db.execute(select(User).order_by(User.id.desc())).scalars().all()
    return [_serialize_user(user) for user in users]


@router.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)) -> UserRead:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return _serialize_user(user)


@router.patch("/users/{user_id}", response_model=AuthResponse)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.name = payload.name.strip()
    user.phone = (payload.phone or "").strip() or None
    if payload.password:
        user.password_hash = hash_password(payload.password)

    db.commit()
    db.refresh(user)
    return AuthResponse(user=_serialize_user(user), message="Профиль обновлен")
