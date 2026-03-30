from pydantic import BaseModel, EmailStr, Field


class ContactRequestCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=255)
    phone: str = Field(min_length=5, max_length=64)
    email: EmailStr | None = None
    subject: str | None = Field(default=None, max_length=255)
    comment: str | None = Field(default=None, max_length=2000)


class ContactRequestRead(BaseModel):
    id: int
    customer_name: str
    phone: str
    email: str | None = None
    subject: str | None = None
    comment: str | None = None

    model_config = {"from_attributes": True}
