from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime

from database import get_database
from routes.admin import verify_token as verify_admin_token

router = APIRouter()


@router.get('/admin/users', response_model=dict)
async def list_users(username: str = Depends(verify_admin_token)):
    """Admin: list registered users with listing counts."""
    try:
        db = get_database()

        users = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).limit(1000).to_list(1000)

        # Aggregate listing counts per owner_user_id
        counts_cursor = db.car_listings.aggregate([
            {"$match": {"owner_user_id": {"$exists": True, "$ne": None}}},
            {"$group": {"_id": "$owner_user_id", "count": {"$sum": 1}}},
        ])
        counts = await counts_cursor.to_list(5000)
        count_map = {c["_id"]: c["count"] for c in counts}

        out = []
        for u in users:
            created_at = u.get("created_at")
            if hasattr(created_at, "isoformat"):
                created_at = created_at.isoformat()
            out.append({
                "id": u.get("id"),
                "first_name": u.get("first_name"),
                "last_name": u.get("last_name"),
                "phone": u.get("phone"),
                "email": u.get("email"),
                "created_at": created_at,
                "listing_count": int(count_map.get(u.get("id"), 0)),
            })

        return {"success": True, "users": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
