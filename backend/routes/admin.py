from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_database
from models.admin import AdminLogin, AdminToken
import bcrypt
import jwt
from datetime import datetime, timedelta
import os

router = APIRouter()
security = HTTPBearer()

# JWT secret - production'da .env'den al
JWT_SECRET = os.environ.get('JWT_SECRET', 'mgzavrobani-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

def create_access_token(username: str) -> str:
    """Create JWT access token"""
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    token_data = {
        "sub": username,
        "exp": expiration
    }
    return jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post('/admin/login', response_model=dict)
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint"""
    try:
        db = get_database()
        
        # Find admin user
        admin = await db.admins.find_one({"username": credentials.username})
        
        if not admin:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        password_valid = bcrypt.checkpw(
            credentials.password.encode('utf-8'),
            admin["password_hash"].encode('utf-8')
        )
        
        if not password_valid:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update last login
        await db.admins.update_one(
            {"_id": admin["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create token
        access_token = create_access_token(credentials.username)
        
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/admin/verify', response_model=dict)
async def verify_admin(username: str = Depends(verify_token)):
    """Verify admin token"""
    return {
        "success": True,
        "username": username
    }

@router.post('/admin/create-first-admin')
async def create_first_admin():
    """Create first admin user - only works if no admin exists"""
    try:
        db = get_database()
        
        # Check if any admin exists
        existing_admin = await db.admins.find_one({})
        if existing_admin:
            raise HTTPException(status_code=400, detail="Admin already exists")
        
        # Create default admin
        # Username: admin, Password: admin123 (değiştirin!)
        password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        admin = {
            "username": "admin",
            "password_hash": password_hash,
            "created_at": datetime.utcnow(),
            "last_login": None
        }
        
        await db.admins.insert_one(admin)
        
        return {
            "success": True,
            "message": "First admin created",
            "username": "admin",
            "password": "admin123",
            "warning": "Please change password immediately!"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))