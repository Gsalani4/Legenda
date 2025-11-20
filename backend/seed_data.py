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

async def seed_vehicles():
    """Seed vehicle data"""
    vehicles = [
        {
            "name": "Toyota Camry",
            "category": "Sedan",
            "price": 80,
            "image": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400",
            "features": ["Automatic", "5 Seats", "AC", "Bluetooth"],
            "available": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Honda CR-V",
            "category": "SUV",
            "price": 120,
            "image": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
            "features": ["Automatic", "7 Seats", "AC", "4WD"],
            "available": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Mercedes E-Class",
            "category": "Premium",
            "price": 200,
            "image": "https://images.unsplash.com/photo-1617531653520-bd466c8f035d?w=400",
            "features": ["Automatic", "5 Seats", "Leather", "Premium"],
            "available": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Hyundai Tucson",
            "category": "SUV",
            "price": 100,
            "image": "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400",
            "features": ["Automatic", "5 Seats", "AC", "GPS"],
            "available": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    await db.vehicles.delete_many({})
    await db.vehicles.insert_many(vehicles)
    print(f"✓ Seeded {len(vehicles)} vehicles")

async def seed_addons():
    """Seed addon data with translations"""
    addons = [
        {
            "addon_id": 1,
            "price": 15,
            "icon": "Shield",
            "on_sale": True,
            "original_price": 20,
            "translations": {
                "ka": {"name": "დაზღვევა (Insurance)", "description": "სრული დაცვის დაზღვევა"},
                "en": {"name": "Super Protective Insurance", "description": "Full coverage insurance"},
                "ru": {"name": "Супер Защитная Страховка", "description": "Полное страховое покрытие"},
                "tr": {"name": "Süper Koruyucu Sigorta", "description": "Tam kapsamlı sigorta"},
                "az": {"name": "Super Qoruyucu Sığorta", "description": "Tam təminat sığortası"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "addon_id": 2,
            "price": 12,
            "icon": "ShieldCheck",
            "on_sale": False,
            "translations": {
                "ka": {"name": "ზარალის დაზღვევა", "description": "ზარალის შემთხვევაში დაცვა"},
                "en": {"name": "Loss Damage Waiver", "description": "Protection in case of damage"},
                "ru": {"name": "Отказ от возмещения ущерба", "description": "Защита в случае повреждения"},
                "tr": {"name": "Hasar Muafiyeti", "description": "Hasar durumunda koruma"},
                "az": {"name": "Zərər Ödənişindən İmtina", "description": "Zərər halında müdafiə"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "addon_id": 3,
            "price": 25,
            "icon": "Accessibility",
            "on_sale": False,
            "translations": {
                "ka": {"name": "შეზღუდული შესაძლებლობების კონტროლი", "description": "სპეციალური მართვის სისტემა"},
                "en": {"name": "Handicap Controls", "description": "Special control system"},
                "ru": {"name": "Управление для инвалидов", "description": "Специальная система управления"},
                "tr": {"name": "Engelli Kontrolleri", "description": "Özel kontrol sistemi"},
                "az": {"name": "Əlil Nəzarəti", "description": "Xüsusi idarəetmə sistemi"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "addon_id": 4,
            "price": 8,
            "icon": "Navigation",
            "on_sale": False,
            "translations": {
                "ka": {"name": "GPS ნავიგაცია", "description": "თანამედროვე GPS სისტემა"},
                "en": {"name": "GPS Navigation", "description": "Modern GPS system"},
                "ru": {"name": "GPS Навигация", "description": "Современная GPS система"},
                "tr": {"name": "GPS Navigasyon", "description": "Modern GPS sistemi"},
                "az": {"name": "GPS Naviqasiya", "description": "Müasir GPS sistemi"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "addon_id": 5,
            "price": 10,
            "icon": "Baby",
            "on_sale": False,
            "translations": {
                "ka": {"name": "ბავშვის სკამი", "description": "უსაფრთხო ბავშვის სკამი"},
                "en": {"name": "Child Seat", "description": "Safe child seat"},
                "ru": {"name": "Детское кресло", "description": "Безопасное детское кресло"},
                "tr": {"name": "Çocuk Koltuğu", "description": "Güvenli çocuk koltuğu"},
                "az": {"name": "Uşaq Oturacağı", "description": "Təhlükəsiz uşaq oturacağı"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "addon_id": 6,
            "price": 5,
            "icon": "Users",
            "on_sale": False,
            "translations": {
                "ka": {"name": "დამატებითი მძღოლი", "description": "მეორე მძღოლის დამატება"},
                "en": {"name": "Additional Driver", "description": "Add second driver"},
                "ru": {"name": "Дополнительный водитель", "description": "Добавить второго водителя"},
                "tr": {"name": "Ek Sürücü", "description": "İkinci sürücü ekle"},
                "az": {"name": "Əlavə Sürücü", "description": "İkinci sürücü əlavə edin"}
            },
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.addons.delete_many({})
    await db.addons.insert_many(addons)
    print(f"✓ Seeded {len(addons)} addons")

async def seed_locations():
    """Seed location data with translations"""
    locations = [
        {
            "location_id": 1,
            "translations": {
                "ka": {"name": "თბილისის აეროპორტი (Tbilisi Airport)", "city": "თბილისი"},
                "en": {"name": "Tbilisi Airport", "city": "Tbilisi"},
                "ru": {"name": "Аэропорт Тбилиси", "city": "Тбилиси"},
                "tr": {"name": "Tiflis Havalimanı", "city": "Tiflis"},
                "az": {"name": "Tiblisi Hava Limanı", "city": "Tiblisi"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "location_id": 2,
            "translations": {
                "ka": {"name": "თამაზ გამყრელიძის 19 (Office)", "city": "თბილისი"},
                "en": {"name": "Tamaz Gamkrelidze 19 (Office)", "city": "Tbilisi"},
                "ru": {"name": "Тамаз Гамкрелидзе 19 (Офис)", "city": "Тбилиси"},
                "tr": {"name": "Tamaz Gamkrelidze 19 (Ofis)", "city": "Tiflis"},
                "az": {"name": "Tamaz Qamkrelidze 19 (Ofis)", "city": "Tiblisi"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "location_id": 3,
            "translations": {
                "ka": {"name": "ბათუმის აეროპორტი (Batumi Airport)", "city": "ბათუმი"},
                "en": {"name": "Batumi Airport", "city": "Batumi"},
                "ru": {"name": "Аэропорт Батуми", "city": "Батуми"},
                "tr": {"name": "Batum Havalimanı", "city": "Batum"},
                "az": {"name": "Batumi Hava Limanı", "city": "Batumi"}
            },
            "created_at": datetime.utcnow()
        },
        {
            "location_id": 4,
            "translations": {
                "ka": {"name": "ქუთაისის აეროპორტი (Kutaisi Airport)", "city": "ქუთაისი"},
                "en": {"name": "Kutaisi Airport", "city": "Kutaisi"},
                "ru": {"name": "Аэропорт Кутаиси", "city": "Кутаиси"},
                "tr": {"name": "Kutaisi Havalimanı", "city": "Kutaisi"},
                "az": {"name": "Kutaisi Hava Limanı", "city": "Kutaisi"}
            },
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.locations.delete_many({})
    await db.locations.insert_many(locations)
    print(f"✓ Seeded {len(locations)} locations")

async def main():
    print("Starting database seeding...")
    await seed_vehicles()
    await seed_addons()
    await seed_locations()
    print("\n✓ Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())