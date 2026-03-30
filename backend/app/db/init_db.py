from sqlalchemy.orm import Session

from app.models.catalog import Collection, CollectionColor
from app.models.user import User
from app.services.catalog import CATALOG_DATA
from app.services.security import hash_password
from app.services.site_settings import ensure_site_settings


def seed_catalog(db: Session) -> None:
    existing = db.query(Collection).count()
    if existing == 0:
        for item_index, item in enumerate(CATALOG_DATA):
            collection = Collection(
                id=item["id"],
                name=item["name"],
                description=item["description"],
                preview_image=item["preview_image"],
                sort_order=item_index,
            )
            db.add(collection)

            for color_index, color in enumerate(item["colors"]):
                db.add(
                    CollectionColor(
                        id=color["id"],
                        collection_id=item["id"],
                        name=color["name"],
                        image=color["image"],
                        felt=color.get("felt"),
                        art=color.get("art"),
                        size=color.get("size"),
                        price=color.get("price"),
                        is_new=color.get("is_new", False),
                        sort_order=color_index,
                    )
                )

        db.commit()

    admin = db.query(User).filter(User.email == "admin@woodapp.ru").first()
    if admin is None:
        db.add(
            User(
                name="Администратор",
                email="admin@woodapp.ru",
                password_hash=hash_password("admin123"),
                role="admin",
            )
        )
        db.commit()

    ensure_site_settings(db)
