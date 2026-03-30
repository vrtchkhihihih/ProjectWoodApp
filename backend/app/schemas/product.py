from pydantic import BaseModel, Field


class ProductColor(BaseModel):
    id: str
    name: str
    image: str
    felt: str | None = None
    art: str | None = None
    size: str | None = None
    price: int | None = None
    is_new: bool = False


class CollectionCard(BaseModel):
    id: str
    name: str
    description: str
    preview_image: str
    colors: list[ProductColor]


class ProductDetail(BaseModel):
    id: str
    name: str
    description: str
    preview_image: str
    colors: list[ProductColor]


class ProductItemCreate(BaseModel):
    collection_id: str = Field(min_length=1, max_length=64)
    name: str = Field(min_length=1, max_length=255)
    image: str = Field(min_length=1, max_length=500)
    felt: str | None = Field(default=None, max_length=64)
    art: str | None = Field(default=None, max_length=64)
    size: str | None = Field(default=None, max_length=128)
    price: int | None = None
    is_new: bool = False


class ProductItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    image: str | None = Field(default=None, min_length=1, max_length=500)
    felt: str | None = Field(default=None, max_length=64)
    art: str | None = Field(default=None, max_length=64)
    size: str | None = Field(default=None, max_length=128)
    price: int | None = None
    is_new: bool | None = None
