from fastapi import APIRouter, HTTPException
from database import get_database
from models.site_settings import SiteSettings, SiteSettingsUpdate, ContactInfo, SocialMedia, BannerSettings
from datetime import datetime

router = APIRouter()

@router.get('/settings', response_model=dict)
async def get_settings():
    """Get site settings"""
    try:
        db = get_database()
        settings = await db.site_settings.find_one({})
        
        if not settings:
            # Create default settings if not exists
            default_settings = {
                "contact": {
                    "phone": "+995 500 88 30 88",
                    "email": "info@legendacar.ge",
                    "address": "თამაზ გამყრელიძის 19",
                    "working_hours": "ორშ - შაბ 8.00 - 18.00"
                },
                "social_media": {
                    "facebook": "https://www.facebook.com/profile.php?id=61573020256578",
                    "instagram": "https://www.instagram.com/legendacar/",
                    "whatsapp": "https://wa.me/995598123456"
                },
                "banner": {
                    "desktop_image_url": "",
                    "mobile_image_url": ""
                },
                "updated_at": datetime.utcnow()
            }
            await db.site_settings.insert_one(default_settings)
            settings = default_settings
        
        return {
            "success": True,
            "settings": {
                "contact": settings["contact"],
                "social_media": settings["social_media"],
                "updated_at": settings["updated_at"].isoformat() if "updated_at" in settings else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put('/settings', response_model=dict)
async def update_settings(settings_update: SiteSettingsUpdate):
    """Update site settings (admin only)"""
    try:
        db = get_database()
        
        # Get current settings or create if not exists
        current_settings = await db.site_settings.find_one({})
        
        if not current_settings:
            # Create new
            new_settings = {
                "contact": settings_update.contact.dict() if settings_update.contact else ContactInfo().dict(),
                "social_media": settings_update.social_media.dict() if settings_update.social_media else SocialMedia().dict(),
                "updated_at": datetime.utcnow()
            }
            await db.site_settings.insert_one(new_settings)
        else:
            # Update existing
            update_data = {"updated_at": datetime.utcnow()}
            
            if settings_update.contact:
                update_data["contact"] = settings_update.contact.dict()
            
            if settings_update.social_media:
                update_data["social_media"] = settings_update.social_media.dict()
            
            await db.site_settings.update_one(
                {"_id": current_settings["_id"]},
                {"$set": update_data}
            )
        
        return {
            "success": True,
            "message": "Site settings updated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))