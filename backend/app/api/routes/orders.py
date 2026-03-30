import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.user import CartItem, User
from app.schemas.order import OrderCreate, OrderRead
from app.services.bitrix import sync_order_to_bitrix


router = APIRouter()


def _serialize_order(order: Order) -> OrderRead:
    return OrderRead.model_validate(order)


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> OrderRead:
    if payload.user_id is not None and db.get(User, payload.user_id) is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    total_amount = 0
    order = Order(
        user_id=payload.user_id,
        order_number=f"WA-TMP-{uuid.uuid4().hex[:8]}",
        status="new",
        customer_name=payload.customer_name,
        phone=payload.phone,
        email=payload.email,
        comment=payload.comment,
        total_amount=0,
    )
    db.add(order)
    db.flush()

    item_lines: list[str] = []
    for item in payload.items:
        line_total = (item.price or 0) * item.quantity
        total_amount += line_total
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                collection_id=item.collection_id,
                product_name=item.product_name,
                image=item.image,
                art=item.art,
                size=item.size,
                felt=item.felt,
                price=item.price,
                quantity=item.quantity,
                line_total=line_total,
            )
        )
        item_lines.append(f"- {item.product_name} x{item.quantity} ({line_total} ₽)")

    order.total_amount = total_amount
    order.order_number = f"WA-{order.id:05d}"
    db.commit()
    db.refresh(order)

    if payload.user_id is not None:
        db.execute(delete(CartItem).where(CartItem.user_id == payload.user_id))
        db.commit()

    sync_order_to_bitrix(
        db,
        order_id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        phone=order.phone,
        email=order.email,
        comment=order.comment,
        total_amount=order.total_amount,
        item_lines=item_lines,
    )

    db.refresh(order)
    return _serialize_order(order)


@router.get("", response_model=list[OrderRead])
def list_orders(user_id: int | None = None, db: Session = Depends(get_db)) -> list[OrderRead]:
    query = select(Order).order_by(Order.id.desc())
    if user_id is not None:
        query = query.where(Order.user_id == user_id)
    items = db.execute(query).scalars().unique().all()
    return [_serialize_order(item) for item in items]
