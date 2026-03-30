from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import CartItem, User
from app.schemas.cart import CartItemCreate, CartItemRead


router = APIRouter()


def _ensure_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user


@router.get("/users/{user_id}/cart", response_model=list[CartItemRead])
def list_cart_items(user_id: int, db: Session = Depends(get_db)) -> list[CartItemRead]:
    _ensure_user(db, user_id)
    items = db.execute(select(CartItem).where(CartItem.user_id == user_id).order_by(CartItem.id.desc())).scalars().all()
    return [CartItemRead.model_validate(item) for item in items]


@router.post("/users/{user_id}/cart/items", response_model=CartItemRead, status_code=status.HTTP_201_CREATED)
def add_cart_item(user_id: int, payload: CartItemCreate, db: Session = Depends(get_db)) -> CartItemRead:
    _ensure_user(db, user_id)
    existing = db.execute(
        select(CartItem).where(CartItem.user_id == user_id, CartItem.product_id == payload.product_id)
    ).scalars().first()
    if existing:
        existing.quantity = payload.quantity
        existing.product_name = payload.product_name
        existing.image = payload.image
        existing.art = payload.art
        existing.size = payload.size
        existing.felt = payload.felt
        existing.price = payload.price
        db.commit()
        db.refresh(existing)
        return CartItemRead.model_validate(existing)

    item = CartItem(user_id=user_id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return CartItemRead.model_validate(item)


@router.delete("/users/{user_id}/cart/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(user_id: int, item_id: int, db: Session = Depends(get_db)) -> None:
    _ensure_user(db, user_id)
    item = db.get(CartItem, item_id)
    if item is None or item.user_id != user_id:
        raise HTTPException(status_code=404, detail="Позиция корзины не найдена")
    db.delete(item)
    db.commit()


@router.delete("/users/{user_id}/cart", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(user_id: int, db: Session = Depends(get_db)) -> None:
    _ensure_user(db, user_id)
    db.execute(delete(CartItem).where(CartItem.user_id == user_id))
    db.commit()
