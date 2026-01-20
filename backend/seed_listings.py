import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_sample_listings():
    """Seed sample car listings"""
    listings = [
        {
            "listing_type": "rental",
            "brand": "Toyota",
            "model": "Camry",
            "year": 2022,
            "price": 80,
            "price_type": "daily",
            "currency": "GEL",
            "mileage": 15000,
            "fuel_type": "Benzin",
            "transmission": "Otomatik",
            "images": [
                "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
                "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600"
            ],
            "description": "Günlük kiralık Toyota Camry. Temiz, bakımlı ve ekonomik araç. Tüm sigortalar dahil.",
            "features": ["Klima", "Bluetooth", "Cruise Control", "Park Sensörü"],
            "status": "active",
            "contact_phone": "+995 500 88 30 88",
            "contact_email": "info@legendacar.ge",
            "views": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "listing_type": "rental",
            "brand": "Honda",
            "model": "CR-V",
            "year": 2023,
            "price": 120,
            "price_type": "daily",
            "currency": "GEL",
            "mileage": 8000,
            "fuel_type": "Benzin",
            "transmission": "Otomatik",
            "images": [
                "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600",
                "https://images.unsplash.com/photo-1606664515197-e49e52b7a885?w=600"
            ],
            "description": "Aileniz için ideal SUV. Geniş iç mekan, güvenli ve konforlu yolculuk.",
            "features": ["7 Kişilik", "4WD", "Klima", "GPS", "Geri Görüş Kamerası"],
            "status": "active",
            "contact_phone": "+995 500 88 30 88",
            "contact_email": "info@legendacar.ge",
            "views": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "listing_type": "sale",
            "brand": "Mercedes",
            "model": "E-Class",
            "year": 2021,
            "price": 45000,
            "price_type": "total",
            "currency": "GEL",
            "mileage": 25000,
            "fuel_type": "Dizel",
            "transmission": "Otomatik",
            "images": [
                "https://images.unsplash.com/photo-1617531653520-bd466c8f035d?w=600",
                "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600"
            ],
            "description": "Satılık Mercedes E-Class. Premium paket, tam bakımlı, tek elden. Tüm kayıtları mevcut.",
            "features": ["Deri Döşeme", "Hafıza Koltuğu", "Panoramik Tavan", "Distronic Plus", "LED Farlar"],
            "status": "active",
            "contact_phone": "+995 500 88 30 88",
            "contact_email": "info@legendacar.ge",
            "views": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "listing_type": "rental",
            "brand": "Hyundai",
            "model": "Tucson",
            "year": 2023,
            "price": 100,
            "price_type": "daily",
            "currency": "GEL",
            "mileage": 5000,
            "fuel_type": "Hibrit",
            "transmission": "Otomatik",
            "images": [
                "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600"
            ],
            "description": "Hibrit teknoloji ile ekonomik ve çevreci sürüş. Modern SUV kiralama imkanı.",
            "features": ["Hibrit", "Smart Cruise", "Lane Assist", "Wireless Charging", "360 Kamera"],
            "status": "active",
            "contact_phone": "+995 500 88 30 88",
            "contact_email": "info@legendacar.ge",
            "views": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Clear existing listings
    await db.car_listings.delete_many({})
    
    # Insert new listings
    await db.car_listings.insert_many(listings)
    print(f"✓ Seeded {len(listings)} car listings")

async def main():
    print("Starting car listings seeding...")
    await seed_sample_listings()
    print("\n✓ Car listings seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
