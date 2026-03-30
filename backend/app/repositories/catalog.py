from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.catalog import Collection
from app.schemas.product import CollectionCard, ProductColor, ProductDetail


def list_collections(db: Session) -> list[CollectionCard]:
    query = (
        select(Collection)
        .options(selectinload(Collection.colors))
        .order_by(Collection.sort_order, Collection.name)
    )
    collections = db.execute(query).scalars().all()

    return [
        CollectionCard(
            id=item.id,
            name=item.name,
            description=item.description,
            preview_image=item.preview_image,
            colors=[
                ProductColor(
                    id=color.id,
                    name=color.name,
                    image=color.image,
                    felt=color.felt,
                    art=color.art,
                    size=color.size,
                    price=color.price,
                    is_new=color.is_new,
                )
                for color in item.colors
            ],
        )
        for item in collections
    ]


def get_collection(db: Session, collection_id: str) -> ProductDetail | None:
    query = (
        select(Collection)
        .where(Collection.id == collection_id)
        .options(selectinload(Collection.colors))
    )
    item = db.execute(query).scalars().first()
    if item is None:
        return None

    return ProductDetail(
        id=item.id,
        name=item.name,
        description=item.description,
        preview_image=item.preview_image,
        colors=[
            ProductColor(
                id=color.id,
                name=color.name,
                image=color.image,
                felt=color.felt,
                art=color.art,
                size=color.size,
                price=color.price,
                is_new=color.is_new,
            )
            for color in item.colors
        ],
    )
