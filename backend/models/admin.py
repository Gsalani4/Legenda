from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Admin(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    class Config:
        populate_by_name = True

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"