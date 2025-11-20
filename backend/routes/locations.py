from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models.location import Location, LocationResponse

router = APIRouter()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.get('/locations', response_model=dict)
async def get_locations(lang: Optional[str] = Query(default="ka")):
    try:
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