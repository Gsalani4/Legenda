from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class CarListing(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    # Tip: kiralık veya satılık
    listing_type: str  # "rental" or "sale"
    
    # Temel bilgiler
    brand: str  # Marka
    model: str  # Model
    year: int  # Yıl
    
    # Fiyat
    price: float
    price_type: str  # "daily", "monthly", "total" (satılık için)
    currency: str = "GEL"  # ₾
    
    # Teknik özellikler
    mileage: int  # Kilometre
    fuel_type: str  # Yakıt tipi (Benzin, Dizel, Elektrik, Hibrit)
    transmission: str  # Vites (Otomatik, Manuel)
    
    # Görseller (max 10)
    images: List[str] = []  # URL listesi
    
    # Açıklama
    description: str
    
    # Ek özellikler
    features: List[str] = []  # ["Klima", "Bluetooth", "GPS" vs.]
    
    # Durum
    status: str = "active"  # "active", "inactive", "sold", "rented"
    
    # İletişim (admin tarafından eklenir)
    contact_phone: str = "+995 500 88 30 88"
    contact_email: str = "info@mgzavrobani.ge"
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    views: int = 0

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CarListingCreate(BaseModel):
    listing_type: str
    brand: str
    model: str
    year: int
    price: float
    price_type: str
    mileage: int
    fuel_type: str
    transmission: str
    images: List[str] = []
    description: str
    features: List[str] = []
    contact_phone: str = "+995 500 88 30 88"
    contact_email: str = "info@mgzavrobani.ge"

class CarListingUpdate(BaseModel):
    listing_type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    price_type: Optional[str] = None
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    status: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None