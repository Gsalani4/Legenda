from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
from bson import ObjectId

class Translation(BaseModel):
    name: str
    description: str

class Addon(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    addon_id: int
    price: float
    icon: str
    on_sale: bool = False
    original_price: Optional[float] = None
    translations: Dict[str, Translation]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class AddonResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    icon: str
    on_sale: bool = False
    original_price: Optional[float] = None