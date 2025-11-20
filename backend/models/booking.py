from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
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

class Customer(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str

class PickupDropoff(BaseModel):
    location_id: int
    date: str
    time: str

class VehicleInfo(BaseModel):
    vehicle_id: str
    name: str
    price: float
    days: int

class AddonInfo(BaseModel):
    addon_id: int
    name: str
    price: float
    quantity: int = 1

class Payment(BaseModel):
    method: str
    total: float
    currency: str = "GEL"

class Booking(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    booking_id: str
    customer: Customer
    pickup: PickupDropoff
    dropoff: PickupDropoff
    vehicle: VehicleInfo
    addons: List[AddonInfo] = []
    payment: Payment
    status: str = "pending"
    language: str = "ka"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BookingCreate(BaseModel):
    customer: Customer
    pickup: PickupDropoff
    dropoff: PickupDropoff
    vehicle_id: str
    addon_ids: List[int] = []
    payment_method: str
    language: str = "ka"

class BookingResponse(BaseModel):
    booking_id: str
    total: float
    status: str
    message: str

class PriceCalculation(BaseModel):
    pickup_date: str
    dropoff_date: str
    vehicle_id: str
    addon_ids: List[int] = []

class PriceCalculationResponse(BaseModel):
    days: int
    vehicle_cost: float
    addons_cost: float
    total: float
    currency: str = "GEL"