from pydantic import BaseModel


class SiteSettingsRead(BaseModel):
    hero_eyebrow: str
    hero_title: str
    hero_button_label: str
    about_eyebrow: str
    about_title: str
    about_text_primary: str
    about_text_secondary: str
    about_quote: str
    bitrix_webhook_url: str
    bitrix_pipeline_id: str
    bitrix_responsible_id: str
    bitrix_sync_orders: bool
    bitrix_sync_contacts: bool
    metrika_counter_id: str
    metrika_enabled: bool


class SiteSettingsUpdate(BaseModel):
    hero_eyebrow: str | None = None
    hero_title: str | None = None
    hero_button_label: str | None = None
    about_eyebrow: str | None = None
    about_title: str | None = None
    about_text_primary: str | None = None
    about_text_secondary: str | None = None
    about_quote: str | None = None
    bitrix_webhook_url: str | None = None
    bitrix_pipeline_id: str | None = None
    bitrix_responsible_id: str | None = None
    bitrix_sync_orders: bool | None = None
    bitrix_sync_contacts: bool | None = None
    metrika_counter_id: str | None = None
    metrika_enabled: bool | None = None
