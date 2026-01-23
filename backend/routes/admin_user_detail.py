from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timedelta
import bcrypt
import secrets
import string

from database import get_database
from routes.admin import verify_token as verify_admin_token

router = APIRouter()

ALLOWED_EXPIRY_DAYS = {1, 5, 7, 10, 15, 20, 30}


def _generate_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


@router.get('/admin/users/{user_id}', response_model=dict)
async def get_user(user_id: str, username: str = Depends(verify_admin_token)):
    try:
        db = get_database()
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        created_at = user.get('created_at')
        if hasattr(created_at, 'isoformat'):
            user['created_at'] = created_at.isoformat()

        return {"success": True, "user": user}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put('/admin/users/{user_id}', response_model=dict)
async def update_user(user_id: str, payload: dict, username: str = Depends(verify_admin_token)):
    """Admin: update user's public info (first_name, last_name, phone, email)."""
    try:
        db = get_database()
        allowed = {"first_name", "last_name", "phone", "email"}
        update = {k: v for k, v in payload.items() if k in allowed}
        if not update:
            raise HTTPException(status_code=400, detail="No fields to update")

        # Unique checks for phone/email
        if 'phone' in update:
            existing = await db.users.find_one({"phone": update['phone'], "id": {"$ne": user_id}})
            if existing:
                raise HTTPException(status_code=400, detail="Phone already registered")
        if 'email' in update and update.get('email'):
            existing = await db.users.find_one({"email": update['email'], "id": {"$ne": user_id}})
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")

        res = await db.users.update_one({"id": user_id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {"success": True, "message": "User updated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/admin/users/{user_id}/reset-password', response_model=dict)
async def reset_password(user_id: str, username: str = Depends(verify_admin_token)):
    """Admin: generate a random password and set it for the user."""
    try:
        db = get_database()
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_password = _generate_password()
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        await db.users.update_one({"id": user_id}, {"$set": {"password_hash": password_hash}})

        return {"success": True, "new_password": new_password}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/admin/users/{user_id}/listings', response_model=dict)
async def get_user_listings(user_id: str, username: str = Depends(verify_admin_token)):
    try:
        db = get_database()
        listings = await db.car_listings.find({"owner_user_id": user_id}).sort("created_at", -1).limit(500).to_list(500)

        out = []
        for l in listings:
            expires_at = l.get('expires_at')
            if hasattr(expires_at, 'isoformat'):
                expires_at = expires_at.isoformat()
            out.append({
                "id": str(l["_id"]),
                "brand": l.get('brand'),
                "model": l.get('model'),
                "year": l.get('year'),
                "price": l.get('price'),
                "status": l.get('status'),
                "created_at": l.get('created_at').isoformat() if hasattr(l.get('created_at'), 'isoformat') else l.get('created_at'),
                "expires_at": expires_at,
            })

        return {"success": True, "listings": out, "allowed_expiry_days": sorted(list(ALLOWED_EXPIRY_DAYS))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/admin/listings/{listing_id}/archive', response_model=dict)
async def archive_listing(listing_id: str, username: str = Depends(verify_admin_token)):
    try:
        db = get_database()
        res = await db.car_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": {"status": "archived", "archived_at": datetime.utcnow(), "archived_by": username, "updated_at": datetime.utcnow()}},
        )
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {"success": True, "message": "Archived"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete('/admin/listings/{listing_id}', response_model=dict)
async def delete_listing_admin(listing_id: str, username: str = Depends(verify_admin_token)):
    try:
        db = get_database()
        res = await db.car_listings.delete_one({"_id": ObjectId(listing_id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {"success": True, "message": "Deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/admin/listings/{listing_id}/set-expiry', response_model=dict)
async def set_listing_expiry(listing_id: str, payload: dict, username: str = Depends(verify_admin_token)):
    """Admin: set expiry days for a listing (expires_at = now + days)."""
    try:
        days = int(payload.get('days', 1))
        if days not in ALLOWED_EXPIRY_DAYS:
            raise HTTPException(status_code=400, detail="Invalid days")

        db = get_database()
        expires_at = datetime.utcnow() + timedelta(days=days)
        res = await db.car_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": {"expires_at": expires_at, "updated_at": datetime.utcnow()}},
        )
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {"success": True, "message": "Expiry updated", "expires_at": expires_at.isoformat()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
