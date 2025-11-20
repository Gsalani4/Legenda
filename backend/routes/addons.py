from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from database import get_database
from models.addon import Addon, AddonResponse

router = APIRouter()

@router.get('/addons', response_model=dict)
async def get_addons(lang: Optional[str] = Query(default="ka")):
    try:
        db = get_database()
        addons = await db.addons.find().to_list(100)
        addon_list = []
        for a in addons:
            translation = a["translations"].get(lang, a["translations"]["en"])
            addon_list.append({
                "id": a["addon_id"],
                "name": translation["name"],
                "description": translation["description"],
                "price": a["price"],
                "icon": a["icon"],
                "on_sale": a.get("on_sale", False),
                "original_price": a.get("original_price")
            })
        return {"success": True, "addons": addon_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))