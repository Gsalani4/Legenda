from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from bson import ObjectId
from datetime import datetime

from database import get_database
from models.car_listing import CarListingCreate, CarListingUpdate
from routes.auth import verify_user_token

router = APIRouter()


@router.get('/user/listings', response_model=dict)
async def get_my_listings(payload: dict = Depends(verify_user_token)):
    """Get listings created by logged-in user."""
    try:
        db = get_database()
        user_id = payload['user_id']

        listings = await db.car_listings.find({"owner_user_id": user_id}).sort("created_at", -1).limit(200).to_list(200)

        out = []
        for listing in listings:
            out.append({
                "id": str(listing["_id"]),
                "listing_type": listing["listing_type"],
                "brand": listing["brand"],
                "model": listing["model"],
                "year": listing["year"],
                "price": listing["price"],
                "price_type": listing["price_type"],
                "currency": listing.get("currency", "GEL"),
                "mileage": listing["mileage"],
                "fuel_type": listing["fuel_type"],
                "transmission": listing["transmission"],
                "images": listing.get("images", []),
                "description": listing["description"],
                "features": listing.get("features", []),
                "status": listing.get("status", "pending"),
                "contact_phone": listing.get("contact_phone"),
                "contact_email": listing.get("contact_email"),
                "views": listing.get("views", 0),
                "created_at": listing["created_at"].isoformat(),
                "updated_at": listing.get("updated_at", listing["created_at"]).isoformat(),
            })

        return {"success": True, "listings": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/user/listings', response_model=dict)
async def create_my_listing(listing_data: CarListingCreate, payload: dict = Depends(verify_user_token)):
    """Create a new listing as a user (status=pending)."""
    try:
        db = get_database()
        user_id = payload['user_id']

        listing = {
            **listing_data.dict(),
            "currency": "GEL",
            "status": "pending",
            "owner_user_id": user_id,
            "views": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = await db.car_listings.insert_one(listing)

        return {
            "success": True,
            "listing_id": str(result.inserted_id),
            "message": "Listing submitted for approval"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put('/user/listings/{listing_id}', response_model=dict)
async def update_my_listing(listing_id: str, listing_data: CarListingUpdate, payload: dict = Depends(verify_user_token)):
    """Update user's own listing. If listing was active, it becomes pending again."""
    try:
        db = get_database()
        user_id = payload['user_id']

        existing = await db.car_listings.find_one({"_id": ObjectId(listing_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if existing.get("owner_user_id") != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")

        update_data = {k: v for k, v in listing_data.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")

        update_data["updated_at"] = datetime.utcnow()

        # re-approval required if already approved
        if existing.get("status") == "active":
            update_data["status"] = "pending"
            update_data["approved_at"] = None
            update_data["approved_by"] = None

        result = await db.car_listings.update_one({"_id": ObjectId(listing_id)}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")

        return {"success": True, "message": "Listing updated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/user/listings/{listing_id}', response_model=dict)
async def delete_my_listing(listing_id: str, payload: dict = Depends(verify_user_token)):
    """Delete user's own listing."""
    try:
        db = get_database()
        user_id = payload['user_id']

        existing = await db.car_listings.find_one({"_id": ObjectId(listing_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if existing.get("owner_user_id") != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")

        result = await db.car_listings.delete_one({"_id": ObjectId(listing_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")

        return {"success": True, "message": "Listing deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
