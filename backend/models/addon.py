from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Translation(BaseModel):
    name: str
    description: str

class Addon(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    addon_id: int
    price: float
    icon: str
    on_sale: bool = False
    original_price: Optional[float] = None
    translations: Dict[str, Translation]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
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