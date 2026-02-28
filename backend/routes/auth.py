from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_database
from models.user import UserCreate, UserLogin
import bcrypt
import jwt
from datetime import datetime, timedelta
from uuid import uuid4
import os

router = APIRouter()
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'legendacar-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24


def _create_access_token(payload: dict) -> str:
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    token_data = {**payload, "exp": expiration}
    return jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        role = payload.get("role")
        if role != "user":
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post('/auth/register', response_model=dict)
async def register(user: UserCreate):
    try:
        db = get_database()
        db_users = db["users"]

        # Unique phone
        existing_phone = await db.users.find_one({"phone": user.phone})
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone already registered")

        if user.email:
            existing_email = await db.users.find_one({"email": user.email})
            if existing_email:
                raise HTTPException(status_code=400, detail="Email already registered")

        password_hash = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        doc = {
            "id": str(uuid4()),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "email": user.email,
            "password_hash": password_hash,
            "created_at": datetime.utcnow(),
        }

        await db.users.insert_one(doc)
        return {"success": True, "message": "Registered"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/auth/login', response_model=dict)
async def login(credentials: UserLogin):
    try:
        db = get_database()
        db_users = db["users"]

        identifier = credentials.identifier.strip()
        query = {"email": identifier} if "@" in identifier else {"phone": identifier}
        user = await db.users.find_one(query)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not bcrypt.checkpw(credentials.password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = _create_access_token({"role": "user", "user_id": user['id']})

        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "role": "user",
            "user": {
                "id": user['id'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "phone": user['phone'],
                "email": user.get('email'),
                "created_at": user['created_at'].isoformat() if hasattr(user['created_at'], 'isoformat') else user['created_at'],
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/auth/me', response_model=dict)
async def me(payload: dict = Depends(verify_user_token)):
    try:
        db = get_database()
        user = await db.users.find_one({"id": payload['user_id']}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user['created_at'] = user['created_at'].isoformat() if hasattr(user['created_at'], 'isoformat') else user['created_at']
        return {"success": True, "user": user}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
