import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.catalog import Collection, CollectionColor
from app.repositories.catalog import get_collection, list_collections
from app.schemas.product import CollectionCard, ProductDetail, ProductItemCreate, ProductItemUpdate
from app.services.catalog import get_collection_cards, get_product_detail


router = APIRouter()


@router.get("", response_model=list[CollectionCard])
def list_products(db: Session = Depends(get_db)) -> list[CollectionCard]:
    try:
        collections = list_collections(db)
        if collections:
            return collections
    except SQLAlchemyError:
        pass

    return get_collection_cards()


@router.get("/{product_id}", response_model=ProductDetail)
def get_product(product_id: str, db: Session = Depends(get_db)) -> ProductDetail:
    product: ProductDetail | None = None
    try:
        product = get_collection(db, product_id)
    except SQLAlchemyError:
        product = None

    if product is None:
        product = get_product_detail(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/items", status_code=status.HTTP_201_CREATED)
def create_product_item(payload: ProductItemCreate, db: Session = Depends(get_db)) -> dict[str, str | int | bool | None]:
    collection = db.get(Collection, payload.collection_id)
    if collection is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")

    max_sort_order = db.execute(
        select(func.max(CollectionColor.sort_order)).where(CollectionColor.collection_id == payload.collection_id)
    ).scalar_one_or_none()

    item = CollectionColor(
        id=f"{payload.collection_id}-{uuid.uuid4().hex[:8]}",
        collection_id=payload.collection_id,
        name=payload.name,
        image=payload.image,
        felt=payload.felt,
        art=payload.art,
        size=payload.size,
        price=payload.price,
        is_new=payload.is_new,
        sort_order=(max_sort_order or 0) + 1,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        "id": item.id,
        "collection_id": item.collection_id,
        "name": item.name,
        "image": item.image,
        "felt": item.felt,
        "art": item.art,
        "size": item.size,
        "price": item.price,
        "is_new": item.is_new,
    }


@router.patch("/items/{item_id}")
def update_product_item(item_id: str, payload: ProductItemUpdate, db: Session = Depends(get_db)) -> dict[str, str | int | bool | None]:
    item = db.get(CollectionColor, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Товар не найден")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return {
        "id": item.id,
        "collection_id": item.collection_id,
        "name": item.name,
        "image": item.image,
        "felt": item.felt,
        "art": item.art,
        "size": item.size,
        "price": item.price,
        "is_new": item.is_new,
    }


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_item(item_id: str, db: Session = Depends(get_db)) -> None:
    item = db.get(CollectionColor, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    db.delete(item)
    db.commit()
