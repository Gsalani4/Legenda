from fastapi import APIRouter, HTTPException, Depends, Query
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from typing import Optional

from database import get_database
from routes.admin import verify_token as verify_admin_token

router = APIRouter()

ALLOWED_EXPIRY_DAYS = {1, 5, 7, 10, 15, 20, 30}
ALLOWED_STATUSES = {"pending", "active", "rejected", "archived"}


async def _auto_archive_expired(db):
    now = datetime.now(timezone.utc)
    await db.car_listings.update_many(
        {"status": "active", "expires_at": {"$ne": None, "$lte": now}},
        {"$set": {"status": "archived", "archived_at": now, "archived_by": "system", "updated_at": now}},
    )


@router.get('/admin/listings', response_model=dict)
async def admin_listings(
    status: str = Query("active"),
    q: Optional[str] = Query(None),
    limit: int = Query(200, le=500),
    listing_type: Optional[str] = Query(None),
    username: str = Depends(verify_admin_token),
):
    """Admin: list listings by status with optional search query."""
    try:
        if status not in ALLOWED_STATUSES and status != "all":
            raise HTTPException(status_code=400, detail="Invalid status")

        db = get_database()
        await _auto_archive_expired(db)

        query = {}
        if status != "all":
            query["status"] = status
        if listing_type:
            query["listing_type"] = listing_type

        if q:
            q = q.strip()
            if q:
                rx = {"$regex": q, "$options": "i"}
                query["$or"] = [
                    {"brand": rx},
                    {"model": rx},
                    {"description": rx},
                    {"contact_phone": rx},
                ]

        listings = await db.car_listings.find(query).sort("created_at", -1).limit(limit).to_list(limit)

        out = []
        for l in listings:
            expires_at = l.get("expires_at")
            if hasattr(expires_at, "isoformat"):
                expires_at = expires_at.isoformat()
            created_at = l.get("created_at")
            if hasattr(created_at, "isoformat"):
                created_at = created_at.isoformat()
            out.append(
                {
                    "id": str(l["_id"]),
                    "listing_type": l.get("listing_type"),
                    "brand": l.get("brand"),
                    "model": l.get("model"),
                    "year": l.get("year"),
                    "price": l.get("price"),
                    "price_type": l.get("price_type"),
                    "currency": l.get("currency", "GEL"),
                    "mileage": l.get("mileage"),
                    "fuel_type": l.get("fuel_type"),
                    "transmission": l.get("transmission"),
                    "images": l.get("images", []),
                    "description": l.get("description"),
                    "features": l.get("features", []),
                    "status": l.get("status"),
                    "owner_user_id": l.get("owner_user_id"),
                    "contact_phone": l.get("contact_phone"),
                    "contact_email": l.get("contact_email"),
                    "views": l.get("views", 0),
                    "created_at": created_at,
                    "expires_at": expires_at,
                }
            )

        return {"success": True, "listings": out, "count": len(out), "status": status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/admin/listings/{listing_id}/status', response_model=dict)
async def set_listing_status(
    listing_id: str,
    payload: dict,
    username: str = Depends(verify_admin_token),
):
    """Admin: set listing status. If status=active, requires days and sets expires_at = now + days."""
    try:
        status = (payload.get("status") or "").strip()
        if status not in ALLOWED_STATUSES:
            raise HTTPException(status_code=400, detail="Invalid status")

        db = get_database()
        now = datetime.now(timezone.utc)

        update = {"status": status, "updated_at": now, "status_updated_by": username, "status_updated_at": now}

        if status == "active":
            days = payload.get("days")
            if days is None:
                raise HTTPException(status_code=400, detail="days is required when activating")
            days = int(days)
            if days not in ALLOWED_EXPIRY_DAYS:
                raise HTTPException(status_code=400, detail="Invalid days")
            update["expires_at"] = now + timedelta(days=days)
            update["activated_by"] = username
            update["activated_at"] = now

        if status == "archived":
            update["archived_at"] = now
            update["archived_by"] = username

        res = await db.car_listings.update_one({"_id": ObjectId(listing_id)}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")

        return {"success": True, "message": "Status updated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
