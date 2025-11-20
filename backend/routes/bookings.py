from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from database import get_database
from models.booking import (
    Booking, BookingCreate, BookingResponse,
    PriceCalculation, PriceCalculationResponse,
    VehicleInfo, AddonInfo, Payment
)
from bson import ObjectId
import random
import string

router = APIRouter()

def generate_booking_id():
    """Generate unique booking ID"""
    date_str = datetime.utcnow().strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.digits, k=3))
    return f"BK-{date_str}-{random_str}"

def calculate_days(pickup_date: str, dropoff_date: str) -> int:
    """Calculate number of days between two dates"""
    from datetime import datetime
    pickup = datetime.strptime(pickup_date, "%Y-%m-%d")
    dropoff = datetime.strptime(dropoff_date, "%Y-%m-%d")
    return max((dropoff - pickup).days, 1)

@router.post('/bookings', response_model=dict)
async def create_booking(booking_data: BookingCreate):
    try:
        db = get_database()
        # Get vehicle details
        vehicle = await db.vehicles.find_one({"_id": ObjectId(booking_data.vehicle_id)})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        # Calculate days
        days = calculate_days(booking_data.pickup.date, booking_data.dropoff.date)
        
        # Calculate vehicle cost
        vehicle_cost = vehicle["price"] * days
        
        # Get addons and calculate cost
        addons_info = []
        addons_cost = 0
        
        if booking_data.addon_ids:
            addons = await db.addons.find({"addon_id": {"$in": booking_data.addon_ids}}).to_list(100)
            for addon in addons:
                translation = addon["translations"].get(booking_data.language, addon["translations"]["en"])
                addon_cost = addon["price"] * days
                addons_cost += addon_cost
                addons_info.append({
                    "addon_id": addon["addon_id"],
                    "name": translation["name"],
                    "price": addon["price"],
                    "quantity": 1
                })
        
        total = vehicle_cost + addons_cost
        
        # Create booking
        booking = {
            "booking_id": generate_booking_id(),
            "customer": booking_data.customer.dict(),
            "pickup": booking_data.pickup.dict(),
            "dropoff": booking_data.dropoff.dict(),
            "vehicle": {
                "vehicle_id": str(vehicle["_id"]),
                "name": vehicle["name"],
                "price": vehicle["price"],
                "days": days
            },
            "addons": addons_info,
            "payment": {
                "method": booking_data.payment_method,
                "total": total,
                "currency": "GEL"
            },
            "status": "pending",
            "language": booking_data.language,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.bookings.insert_one(booking)
        
        return {
            "success": True,
            "booking": {
                "booking_id": booking["booking_id"],
                "total": total,
                "status": "pending",
                "message": "Booking created successfully. Our operator will contact you soon."
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/bookings/{booking_id}', response_model=dict)
async def get_booking(booking_id: str):
    try:
        db = get_database()
        booking = await db.bookings.find_one({"booking_id": booking_id})
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        booking["_id"] = str(booking["_id"])
        return {"success": True, "booking": booking}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/calculate-price', response_model=dict)
async def calculate_price(calc: PriceCalculation):
    try:
        db = get_database()
        # Get vehicle
        vehicle = await db.vehicles.find_one({"_id": ObjectId(calc.vehicle_id)})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        # Calculate days
        days = calculate_days(calc.pickup_date, calc.dropoff_date)
        
        # Calculate vehicle cost
        vehicle_cost = vehicle["price"] * days
        
        # Calculate addons cost
        addons_cost = 0
        if calc.addon_ids:
            addons = await db.addons.find({"addon_id": {"$in": calc.addon_ids}}).to_list(100)
            for addon in addons:
                addons_cost += addon["price"] * days
        
        total = vehicle_cost + addons_cost
        
        return {
            "success": True,
            "calculation": {
                "days": days,
                "vehicle_cost": vehicle_cost,
                "addons_cost": addons_cost,
                "total": total,
                "currency": "GEL"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))