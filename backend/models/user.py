from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None
    password: str


class UserLogin(BaseModel):
    identifier: str  # email or phone
    password: str


class UserPublic(BaseModel):
    id: str
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None
    created_at: datetime


class AuthToken(BaseModel):
    success: bool = True
    access_token: str
    token_type: str = "bearer"
    role: str
    user: Optional[UserPublic] = None
