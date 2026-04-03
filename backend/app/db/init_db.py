from sqlalchemy.orm import Session

from app.models.catalog import Collection, CollectionColor
from app.models.user import User
from app.services.catalog import CATALOG_DATA
from app.services.security import hash_password
from app.services.site_settings import ensure_site_settings


def seed_catalog(db: Session) -> None:
    for item_index, item in enumerate(CATALOG_DATA):
        collection = db.get(Collection, item["id"])
        if collection is None:
            collection = Collection(id=item["id"])
            db.add(collection)

        collection.name = item["name"]
        collection.description = item["description"]
        collection.preview_image = item["preview_image"]
        collection.sort_order = item_index

        expected_color_ids = {color["id"] for color in item["colors"]}
        existing_colors = {
            color.id: color
            for color in db.query(CollectionColor).filter(CollectionColor.collection_id == item["id"]).all()
        }

        for color_index, color in enumerate(item["colors"]):
            color_row = existing_colors.get(color["id"])
            if color_row is None:
                color_row = CollectionColor(id=color["id"], collection_id=item["id"])
                db.add(color_row)

            color_row.name = color["name"]
            color_row.image = color["image"]
            color_row.felt = color.get("felt")
            color_row.art = color.get("art")
            color_row.size = color.get("size")
            color_row.price = color.get("price")
            color_row.is_new = color.get("is_new", False)
            color_row.sort_order = color_index

        for color_id, color_row in existing_colors.items():
            if color_id not in expected_color_ids:
                db.delete(color_row)

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
