from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class Vehicle(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    category: str
    price: float
    image: str
    features: List[str]
    available: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class VehicleResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    image: str
    features: List[str]
    available: bool