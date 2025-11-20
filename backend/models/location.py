from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
from bson import ObjectId

class LocationTranslation(BaseModel):
    name: str
    city: str

class Location(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    location_id: int
    translations: Dict[str, LocationTranslation]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class LocationResponse(BaseModel):
    id: int
    name: str
    city: str