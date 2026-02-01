from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timedelta, timezone

from database import get_database
from routes.admin import verify_token as verify_admin_token

router = APIRouter()

ALLOWED_DAYS = {1, 5, 7, 10, 15, 20, 30}


async def _auto_disable_expired_vip(db):
    now = datetime.now(timezone.utc)
    await db.car_listings.update_many(
        {"is_vip": True, "vip_until": {"$ne": None, "$lte": now}},
        {"$set": {"is_vip": False, "vip_rank": None, "vip_updated_at": now}},
    )


@router.post('/admin/listings/{listing_id}/vip', response_model=dict)
async def set_vip(
    listing_id: str,
    payload: dict,
    username: str = Depends(verify_admin_token),
):
    """Admin: enable/disable VIP for a listing. If enable=true, requires days and optionally rank."""
    try:
        enable = bool(payload.get("enable"))
        db = get_database()
        now = datetime.now(timezone.utc)

        if enable:
            days = payload.get("days")
            if days is None:
                raise HTTPException(status_code=400, detail="days is required when enabling VIP")
            days = int(days)
            if days not in ALLOWED_DAYS:
                raise HTTPException(status_code=400, detail="Invalid days")

            rank = payload.get("rank")
            if rank is not None:
                rank = int(rank)

            update = {
                "is_vip": True,
                "vip_until": now + timedelta(days=days),
                "vip_rank": rank,
                "vip_updated_at": now,
                "vip_updated_by": username,
                "updated_at": now,
            }
        else:
            update = {
                "is_vip": False,
                "vip_until": None,
                "vip_rank": None,
                "vip_updated_at": now,
                "vip_updated_by": username,
                "updated_at": now,
            }

        res = await db.car_listings.update_one({"_id": ObjectId(listing_id)}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")

        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/admin/vip-listings', response_model=dict)
async def list_vip(username: str = Depends(verify_admin_token)):
    """Admin: list current VIP listings."""
    try:
        db = get_database()
        await _auto_disable_expired_vip(db)

        listings = await db.car_listings.find({"is_vip": True}).sort([
            ("vip_rank", 1),
            ("created_at", -1),
        ]).limit(200).to_list(200)

        out = []
        for listing in listings:
            expires_at = listing.get("expires_at")
            if hasattr(expires_at, "isoformat"):
                expires_at = expires_at.isoformat()
            vip_until = listing.get("vip_until")
            if hasattr(vip_until, "isoformat"):
                vip_until = vip_until.isoformat()
            out.append({
                "id": str(listing["_id"]),
                "brand": listing.get("brand"),
                "model": listing.get("model"),
                "year": listing.get("year"),
                "price": listing.get("price"),
                "listing_type": listing.get("listing_type"),
                "images": listing.get("images", []),
                "status": listing.get("status"),
                "vip_rank": listing.get("vip_rank"),
                "vip_until": vip_until,
                "expires_at": expires_at,
            })

        return {"success": True, "listings": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
