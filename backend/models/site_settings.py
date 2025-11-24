from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SocialMedia(BaseModel):
    facebook: str = "https://www.facebook.com/profile.php?id=61573020256578"
    instagram: str = "https://www.instagram.com/mgzavrobani/"
    whatsapp: str = "https://wa.me/995598123456"

class ContactInfo(BaseModel):
    phone: str = "+995 500 88 30 88"
    email: str = "info@mgzavrobani.ge"
    address: str = "თამაზ გამყრელიძის 19"
    working_hours: str = "ორშ - შაბ 8.00 - 18.00"

class SiteSettings(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    contact: ContactInfo = Field(default_factory=ContactInfo)
    social_media: SocialMedia = Field(default_factory=SocialMedia)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class SiteSettingsUpdate(BaseModel):
    contact: Optional[ContactInfo] = None
    social_media: Optional[SocialMedia] = None