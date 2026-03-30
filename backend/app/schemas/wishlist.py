from pydantic import BaseModel, Field


class WishlistItemCreate(BaseModel):
    product_id: str = Field(min_length=1, max_length=64)
    collection_id: str = Field(min_length=1, max_length=64)
    product_name: str = Field(min_length=1, max_length=255)
    image: str = Field(min_length=1, max_length=500)
    art: str | None = Field(default=None, max_length=64)
    size: str | None = Field(default=None, max_length=128)
    felt: str | None = Field(default=None, max_length=64)
    price: int | None = None
    note: str | None = Field(default=None, max_length=2000)


class WishlistItemRead(BaseModel):
    id: int
    user_id: int
    product_id: str
    collection_id: str
    product_name: str
    image: str
    art: str | None = None
    size: str | None = None
    felt: str | None = None
    price: int | None = None
    note: str | None = None

    model_config = {"from_attributes": True}
