from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes.car_listings import router as listings_router
from routes.admin import router as admin_router
from routes.site_settings import router as settings_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="LEGENDACAR API", version="2.0.0")

# Create API router
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "LEGENDACAR Car Listings API", "status": "active", "version": "2.0.0"}

# Include routers
api_router.include_router(listings_router, tags=["listings"])
api_router.include_router(admin_router, tags=["admin"])
api_router.include_router(settings_router, tags=["settings"])

# Include API router in main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()