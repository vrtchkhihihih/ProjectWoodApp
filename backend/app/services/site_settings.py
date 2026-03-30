from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site import SiteSetting
from app.schemas.settings import SiteSettingsRead, SiteSettingsUpdate


DEFAULT_SITE_SETTINGS = {
    "hero_eyebrow": "Wood App - акустика и дизайн",
    "hero_title": "Акустические панели",
    "hero_button_label": "Смотреть каталог",
    "about_eyebrow": "About Us",
    "about_title": "Привет! Мы рады приветствовать вас.",
    "about_text_primary": "Мы создаем акустические панели для пространств, где важны не только форма и свет, но и звук.",
    "about_text_secondary": "Наши решения объединяют технологию и дизайн, чтобы интерьер работал на ощущение спокойствия, глубины и комфорта.",
    "about_quote": "Мы работаем с теми, кто понимает: правильно созданное пространство - это не только красота. Тишина тоже роскошь.",
    "bitrix_webhook_url": "",
    "bitrix_pipeline_id": "0",
    "bitrix_responsible_id": "1",
    "bitrix_sync_orders": "1",
    "bitrix_sync_contacts": "1",
    "metrika_counter_id": "",
    "metrika_enabled": "0",
}

BOOLEAN_KEYS = {"bitrix_sync_orders", "bitrix_sync_contacts", "metrika_enabled"}


def ensure_site_settings(db: Session) -> None:
    changed = False
    for key, value in DEFAULT_SITE_SETTINGS.items():
        existing = db.get(SiteSetting, key)
        if existing is None:
            db.add(SiteSetting(key=key, value=value))
            changed = True
    if changed:
        db.commit()


def _deserialize_value(key: str, value: str | None) -> str | bool:
    if key in BOOLEAN_KEYS:
        return value == "1"
    return value or ""


def get_site_settings(db: Session) -> SiteSettingsRead:
    ensure_site_settings(db)
    rows = db.execute(select(SiteSetting)).scalars().all()
    values = {row.key: _deserialize_value(row.key, row.value) for row in rows}
    payload = {**{k: _deserialize_value(k, v) for k, v in DEFAULT_SITE_SETTINGS.items()}, **values}
    return SiteSettingsRead(**payload)


def update_site_settings(db: Session, payload: SiteSettingsUpdate) -> SiteSettingsRead:
    ensure_site_settings(db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        row = db.get(SiteSetting, key)
        serialized = "1" if isinstance(value, bool) and value else "0" if isinstance(value, bool) else value
        if row is None:
            db.add(SiteSetting(key=key, value=serialized))
        else:
            row.value = serialized
    db.commit()
    return get_site_settings(db)
