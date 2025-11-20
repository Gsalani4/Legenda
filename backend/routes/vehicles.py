from fastapi import APIRouter, HTTPException
from typing import List
from database import get_database
from models.vehicle import Vehicle, VehicleResponse
from bson import ObjectId

router = APIRouter()

@router.get('/vehicles', response_model=dict)
async def get_vehicles():
    try:
        db = get_database()
        vehicles = await db.vehicles.find().to_list(100)
        vehicle_list = []
        for v in vehicles:
            vehicle_list.append({
                "id": str(v["_id"]),
                "name": v["name"],
                "category": v["category"],
                "price": v["price"],
                "image": v["image"],
                "features": v["features"],
                "available": v["available"]
            })
        return {"success": True, "vehicles": vehicle_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/vehicles/{vehicle_id}', response_model=dict)
async def get_vehicle(vehicle_id: str):
    try:
        db = get_database()
        vehicle = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        return {
            "success": True,
            "vehicle": {
                "id": str(vehicle["_id"]),
                "name": vehicle["name"],
                "category": vehicle["category"],
                "price": vehicle["price"],
                "image": vehicle["image"],
                "features": vehicle["features"],
                "available": vehicle["available"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))