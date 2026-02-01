from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from database import get_database
from models.car_listing import CarListing, CarListingCreate, CarListingUpdate
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter()

@router.get('/listings', response_model=dict)
async def get_listings(
    listing_type: Optional[str] = Query(None),
    status: Optional[str] = Query("active"),
    limit: int = Query(100, le=100),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_year: Optional[int] = Query(None),
    max_year: Optional[int] = Query(None),
    min_mileage: Optional[int] = Query(None),
    max_mileage: Optional[int] = Query(None),
    fuel_type: Optional[str] = Query(None),
    transmission: Optional[str] = Query(None),
):
    """Get all car listings with optional filters"""
    try:
        db = get_database()
        query = {}
        
        if listing_type:
            query["listing_type"] = listing_type

        # Auto-archive expired active listings
        now = datetime.now(timezone.utc)
        await db.car_listings.update_many(
            {"status": "active", "expires_at": {"$ne": None, "$lte": now}},
            {"$set": {"status": "archived", "archived_at": now, "archived_by": "system", "updated_at": now}},
        )

        # Public listing rules: default active and not expired
        if status:
            query["status"] = status
        if status == "active":
            query["$or"] = [
                {"expires_at": {"$exists": False}},
                {"expires_at": None},
                {"expires_at": {"$gt": now}},
            ]
            
        # Auto-disable VIP if expired
        await db.car_listings.update_many(
            {"is_vip": True, "vip_until": {"$ne": None, "$lte": now}},
            {"$set": {"is_vip": False, "vip_rank": None, "vip_updated_at": now}},
        )

        listings = await db.car_listings.find(query).sort("created_at", -1).limit(limit).to_list(limit)
        
        listing_list = []
        for listing in listings:
            listing_list.append({
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
                "status": listing["status"],
                "contact_phone": listing.get("contact_phone", "+995 500 88 30 88"),
                "contact_email": listing.get("contact_email", "info@legendacar.ge"),
                "views": listing.get("views", 0),
                "created_at": listing["created_at"].isoformat(),
                "expires_at": listing.get("expires_at").isoformat() if hasattr(listing.get("expires_at"), "isoformat") else None,
                "is_vip": bool(listing.get("is_vip", False)),
                "vip_until": listing.get("vip_until").isoformat() if hasattr(listing.get("vip_until"), "isoformat") else None,
                "vip_rank": listing.get("vip_rank")
            })
        
        return {"success": True, "listings": listing_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/listings/{listing_id}', response_model=dict)
async def get_listing(listing_id: str):
    """Get single listing by ID and increment view count"""
    try:
        db = get_database()
        listing = await db.car_listings.find_one({"_id": ObjectId(listing_id)})

        owner = None
        owner_id = listing.get("owner_user_id") if listing else None
        if owner_id:
            user = await db.users.find_one({"id": owner_id}, {"_id": 0, "password_hash": 0})
            if user:
                owner = {
                    "first_name": user.get("first_name"),
                    "last_name": user.get("last_name"),
                }
        
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        # Increment view count
        await db.car_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$inc": {"views": 1}}
        )
        
        return {
            "success": True,
            "listing": {
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
                "status": listing["status"],
                "contact_phone": listing.get("contact_phone", "+995 500 88 30 88"),
                "contact_email": listing.get("contact_email", "info@legendacar.ge"),
                "views": listing.get("views", 0) + 1,
                "created_at": listing["created_at"].isoformat(),
                "expires_at": listing.get("expires_at").isoformat() if hasattr(listing.get("expires_at"), "isoformat") else None,
                "is_vip": bool(listing.get("is_vip", False)),
                "vip_until": listing.get("vip_until").isoformat() if hasattr(listing.get("vip_until"), "isoformat") else None,
                "vip_rank": listing.get("vip_rank"),
                "updated_at": listing.get("updated_at", listing["created_at"]).isoformat(),
                "owner": owner
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/listings', response_model=dict)
async def create_listing(listing_data: CarListingCreate):
    """Create new car listing (admin only - will add auth later)"""
    try:
        db = get_database()
        
        listing = {
            **listing_data.dict(),
            "currency": "GEL",
            "status": "active",
            "views": 0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        result = await db.car_listings.insert_one(listing)
        
        return {
            "success": True,
            "listing_id": str(result.inserted_id),
            "message": "Listing created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put('/listings/{listing_id}', response_model=dict)
async def update_listing(listing_id: str, listing_data: CarListingUpdate):
    """Update car listing (admin only - will add auth later)"""
    try:
        db = get_database()
        
        # Get only non-None values
        update_data = {k: v for k, v in listing_data.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        result = await db.car_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        return {
            "success": True,
            "message": "Listing updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete('/listings/{listing_id}', response_model=dict)
async def delete_listing(listing_id: str):
    """Delete car listing (admin only - will add auth later)"""
    try:
        db = get_database()
        
        result = await db.car_listings.delete_one({"_id": ObjectId(listing_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        return {
            "success": True,
            "message": "Listing deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))