from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=64)
    password: str = Field(min_length=6, max_length=255)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=255)


class UserUpdate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    phone: str | None = Field(default=None, max_length=64)
    password: str | None = Field(default=None, min_length=6, max_length=255)


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None = None
    role: str

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    user: UserRead
    message: str
