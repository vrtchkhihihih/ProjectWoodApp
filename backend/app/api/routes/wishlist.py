from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, WishlistItem
from app.schemas.wishlist import WishlistItemCreate, WishlistItemRead


router = APIRouter()


def _ensure_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user


@router.get("/users/{user_id}/wishlist", response_model=list[WishlistItemRead])
def list_wishlist_items(user_id: int, db: Session = Depends(get_db)) -> list[WishlistItemRead]:
    _ensure_user(db, user_id)
    items = db.execute(select(WishlistItem).where(WishlistItem.user_id == user_id).order_by(WishlistItem.id.desc())).scalars().all()
    return [WishlistItemRead.model_validate(item) for item in items]


@router.post("/users/{user_id}/wishlist/items", response_model=WishlistItemRead, status_code=status.HTTP_201_CREATED)
def add_wishlist_item(user_id: int, payload: WishlistItemCreate, db: Session = Depends(get_db)) -> WishlistItemRead:
    _ensure_user(db, user_id)
    existing = db.execute(
        select(WishlistItem).where(WishlistItem.user_id == user_id, WishlistItem.product_id == payload.product_id)
    ).scalars().first()
    if existing:
        return WishlistItemRead.model_validate(existing)

    item = WishlistItem(user_id=user_id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return WishlistItemRead.model_validate(item)


@router.delete("/users/{user_id}/wishlist/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wishlist_item(user_id: int, item_id: int, db: Session = Depends(get_db)) -> None:
    _ensure_user(db, user_id)
    item = db.get(WishlistItem, item_id)
    if item is None or item.user_id != user_id:
        raise HTTPException(status_code=404, detail="Позиция избранного не найдена")
    db.delete(item)
    db.commit()


@router.delete("/users/{user_id}/wishlist", status_code=status.HTTP_204_NO_CONTENT)
def clear_wishlist(user_id: int, db: Session = Depends(get_db)) -> None:
    _ensure_user(db, user_id)
    db.execute(delete(WishlistItem).where(WishlistItem.user_id == user_id))
    db.commit()
