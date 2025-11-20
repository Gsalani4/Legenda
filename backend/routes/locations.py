from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from database import get_database
from models.location import Location, LocationResponse

router = APIRouter()

@router.get('/locations', response_model=dict)
async def get_locations(lang: Optional[str] = Query(default="ka")):
    try:
        db = get_database()
        locations = await db.locations.find().to_list(100)
        location_list = []
        for loc in locations:
            translation = loc["translations"].get(lang, loc["translations"]["en"])
            location_list.append({
                "id": loc["location_id"],
                "name": translation["name"],
                "city": translation["city"]
            })
        return {"success": True, "locations": location_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))