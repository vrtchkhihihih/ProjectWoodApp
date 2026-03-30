from pydantic import BaseModel, EmailStr, Field


class OrderItemCreate(BaseModel):
    product_id: str | None = Field(default=None, max_length=64)
    collection_id: str | None = Field(default=None, max_length=64)
    product_name: str = Field(min_length=1, max_length=255)
    image: str = Field(min_length=1, max_length=500)
    art: str | None = Field(default=None, max_length=64)
    size: str | None = Field(default=None, max_length=128)
    felt: str | None = Field(default=None, max_length=64)
    price: int | None = None
    quantity: int = Field(default=1, ge=1, le=99)


class OrderCreate(BaseModel):
    user_id: int | None = None
    customer_name: str = Field(min_length=2, max_length=255)
    phone: str = Field(min_length=5, max_length=64)
    email: EmailStr
    comment: str | None = Field(default=None, max_length=2000)
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemRead(BaseModel):
    id: int
    product_id: str | None = None
    collection_id: str | None = None
    product_name: str
    image: str
    art: str | None = None
    size: str | None = None
    felt: str | None = None
    price: int | None = None
    quantity: int
    line_total: int

    model_config = {"from_attributes": True}


class OrderRead(BaseModel):
    id: int
    user_id: int | None = None
    order_number: str
    status: str
    customer_name: str
    phone: str
    email: str
    comment: str | None = None
    total_amount: int
    items: list[OrderItemRead]

    model_config = {"from_attributes": True}
