# API Contracts & Backend Implementation Plan

## Overview
Full-stack car rental reservation system with 5-language support (Georgian, English, Russian, Turkish, Azerbaijani).

## Frontend Mock Data (To Be Replaced with Backend APIs)

### 1. Mock Data Files
- `/app/frontend/src/mockData.js` - Contains vehicles, addons, locations mock data
- All data will be replaced with actual API calls

### 2. LocalStorage Usage (To Be Migrated)
- `rentalCart` - Cart items
- `lastBooking` - Last booking details
- `preferredLanguage` - User's language preference (keep in frontend)

## Backend Database Models

### 1. Vehicle Model
```python
{
  "_id": ObjectId,
  "name": str,  # "Toyota Camry"
  "category": str,  # "Sedan", "SUV", "Premium"
  "price": float,  # Daily rental price in GEL
  "image": str,  # Image URL
  "features": [str],  # ["Automatic", "5 Seats", "AC"]
  "available": bool,
  "created_at": datetime,
  "updated_at": datetime
}
```

### 2. Addon Model
```python
{
  "_id": ObjectId,
  "addon_id": int,  # Unique identifier (1-6)
  "price": float,  # Daily price
  "icon": str,
  "on_sale": bool,
  "original_price": float,  # If on_sale
  "translations": {
    "ka": {"name": str, "description": str},
    "en": {"name": str, "description": str},
    "ru": {"name": str, "description": str},
    "tr": {"name": str, "description": str},
    "az": {"name": str, "description": str}
  },
  "created_at": datetime
}
```

### 3. Location Model
```python
{
  "_id": ObjectId,
  "location_id": int,  # Unique identifier (1-4)
  "translations": {
    "ka": {"name": str, "city": str},
    "en": {"name": str, "city": str},
    "ru": {"name": str, "city": str},
    "tr": {"name": str, "city": str},
    "az": {"name": str, "city": str}
  },
  "created_at": datetime
}
```

### 4. Booking/Reservation Model
```python
{
  "_id": ObjectId,
  "booking_id": str,  # Unique booking reference
  "customer": {
    "first_name": str,
    "last_name": str,
    "email": str,
    "phone": str
  },
  "pickup": {
    "location_id": int,
    "date": str,  # "2024-01-15"
    "time": str   # "10:00"
  },
  "dropoff": {
    "location_id": int,
    "date": str,
    "time": str
  },
  "vehicle": {
    "vehicle_id": ObjectId,
    "name": str,
    "price": float,
    "days": int
  },
  "addons": [{
    "addon_id": int,
    "name": str,
    "price": float,
    "quantity": int
  }],
  "payment": {
    "method": str,  # "card", "cash", "transfer"
    "total": float,
    "currency": str  # "GEL"
  },
  "status": str,  # "pending", "confirmed", "cancelled", "completed"
  "language": str,  # User's preferred language
  "created_at": datetime,
  "updated_at": datetime
}
```

## API Endpoints

### 1. GET /api/vehicles
**Description**: Get all available vehicles
**Response**:
```json
{
  "success": true,
  "vehicles": [
    {
      "id": "...",
      "name": "Toyota Camry",
      "category": "Sedan",
      "price": 80,
      "image": "https://...",
      "features": ["Automatic", "5 Seats", "AC"],
      "available": true
    }
  ]
}
```

### 2. GET /api/addons
**Description**: Get all available addons with translations
**Query Parameters**: `?lang=ka` (optional, defaults to "ka")
**Response**:
```json
{
  "success": true,
  "addons": [
    {
      "id": 1,
      "name": "Super Protective Insurance",
      "description": "Full coverage insurance",
      "price": 15,
      "icon": "Shield",
      "on_sale": true,
      "original_price": 20
    }
  ]
}
```

### 3. GET /api/locations
**Description**: Get all pickup/dropoff locations
**Query Parameters**: `?lang=ka` (optional)
**Response**:
```json
{
  "success": true,
  "locations": [
    {
      "id": 1,
      "name": "Tbilisi Airport",
      "city": "Tbilisi"
    }
  ]
}
```

### 4. POST /api/bookings
**Description**: Create a new booking
**Request Body**:
```json
{
  "customer": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+995555123456"
  },
  "pickup": {
    "location_id": 1,
    "date": "2024-01-15",
    "time": "10:00"
  },
  "dropoff": {
    "location_id": 2,
    "date": "2024-01-20",
    "time": "10:00"
  },
  "vehicle_id": "...",
  "addon_ids": [1, 4, 5],
  "payment_method": "card",
  "language": "en"
}
```
**Response**:
```json
{
  "success": true,
  "booking": {
    "booking_id": "BK-20240115-001",
    "total": 450,
    "status": "pending",
    "message": "Booking created successfully. Our operator will contact you soon."
  }
}
```

### 5. GET /api/bookings/:booking_id
**Description**: Get booking details by ID
**Response**: Full booking object

### 6. POST /api/calculate-price
**Description**: Calculate total price for a booking
**Request Body**:
```json
{
  "pickup_date": "2024-01-15",
  "dropoff_date": "2024-01-20",
  "vehicle_id": "...",
  "addon_ids": [1, 4]
}
```
**Response**:
```json
{
  "success": true,
  "calculation": {
    "days": 5,
    "vehicle_cost": 400,
    "addons_cost": 115,
    "total": 515,
    "currency": "GEL"
  }
}
```

## Frontend Integration Changes

### Files to Update:
1. `/app/frontend/src/pages/CheckoutPage.jsx`
   - Replace mock data with API calls
   - Add axios calls to fetch vehicles, addons, locations
   - Update handleSubmit to POST to /api/bookings

2. `/app/frontend/src/mockData.js`
   - Keep as fallback or remove after backend integration

### API Service File to Create:
`/app/frontend/src/services/api.js`
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const vehicleService = {
  getAll: () => axios.get(`${API_URL}/vehicles`)
};

export const addonService = {
  getAll: (lang) => axios.get(`${API_URL}/addons?lang=${lang}`)
};

export const locationService = {
  getAll: (lang) => axios.get(`${API_URL}/locations?lang=${lang}`)
};

export const bookingService = {
  create: (data) => axios.post(`${API_URL}/bookings`, data),
  getById: (id) => axios.get(`${API_URL}/bookings/${id}`),
  calculatePrice: (data) => axios.post(`${API_URL}/calculate-price`, data)
};
```

## Implementation Order

### Phase 1: Backend Setup
1. Create MongoDB models in `/app/backend/models/`
2. Create API routes in `/app/backend/routes/`
3. Seed initial data (vehicles, addons, locations)

### Phase 2: API Implementation
1. Implement GET endpoints (vehicles, addons, locations)
2. Implement POST booking endpoint
3. Implement price calculation endpoint
4. Add validation and error handling

### Phase 3: Frontend Integration
1. Create API service layer
2. Replace mock data with API calls
3. Update CheckoutPage to use real data
4. Add loading states and error handling
5. Test complete flow

### Phase 4: Testing
1. Test all API endpoints with curl/Postman
2. Test frontend with real backend data
3. Test booking creation flow
4. Test multi-language support with backend data

## Notes
- All prices in Georgian Lari (GEL) symbol ₾
- Language preference stored in localStorage (frontend only)
- Booking data needs validation (dates, email, phone)
- Consider adding email notification service later
- Add admin panel for managing vehicles/addons in future
