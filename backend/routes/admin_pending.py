from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timedelta, timezone

from database import get_database
from routes.admin import verify_token as verify_admin_token

router = APIRouter()


@router.get('/admin/pending-listings', response_model=dict)
async def get_pending_listings(username: str = Depends(verify_admin_token)):
    """Admin: list pending listings for approval."""
    try:
        db = get_database()
        listings = await db.car_listings.find({"status": "pending"}).sort("created_at", -1).limit(200).to_list(200)

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
                "owner_user_id": listing.get("owner_user_id"),
                "contact_phone": listing.get("contact_phone"),
                "contact_email": listing.get("contact_email"),
                "views": listing.get("views", 0),
                "created_at": listing["created_at"].isoformat(),
            })

        return {"success": True, "listings": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/admin/listings/{listing_id}/approve', response_model=dict)
async def approve_listing(listing_id: str, payload: dict = None, username: str = Depends(verify_admin_token)):
    """Admin: approve a pending listing and set expiry days (default 1 day)."""
    try:
        db = get_database()

        days = 1
        if isinstance(payload, dict) and payload.get('days') is not None:
            days = int(payload.get('days'))
        if days not in {1, 5, 7, 10, 15, 20, 30}:
            raise HTTPException(status_code=400, detail="Invalid days")

        expires_at = datetime.now(timezone.utc) + timedelta(days=days)

        result = await db.car_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": {"status": "active", "approved_at": datetime.now(timezone.utc), "approved_by": username, "expires_at": expires_at, "updated_at": datetime.now(timezone.utc)}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {"success": True, "message": "Approved"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/admin/listings/{listing_id}/reject', response_model=dict)
async def reject_listing(listing_id: str, username: str = Depends(verify_admin_token)):
    """Admin: reject a pending listing."""
    try:
        db = get_database()
        result = await db.car_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": {"status": "rejected", "rejected_at": datetime.now(timezone.utc), "rejected_by": username, "updated_at": datetime.now(timezone.utc)}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {"success": True, "message": "Rejected"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
