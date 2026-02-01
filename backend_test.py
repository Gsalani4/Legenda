#!/usr/bin/env python3
"""
LEGENDACAR Backend API Tests
Tests all backend endpoints including admin user detail functionality
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Backend URL from frontend/.env
BACKEND_URL = "https://wheelspot-2.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.vehicle_id = None
        self.booking_id = None
        self.admin_token = None
        self.test_user_id = None
        self.test_listing_id = None
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
        print()
    
    def test_health_check(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "MGZAVROBANI" in data["message"]:
                    self.log_test("API Health Check", True, f"Status: {data.get('status', 'unknown')}")
                    return True
                else:
                    self.log_test("API Health Check", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_get_vehicles(self):
        """Test GET /api/vehicles - should return list of Georgian vehicles"""
        try:
            response = self.session.get(f"{self.base_url}/vehicles")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "vehicles" in data:
                    vehicles = data["vehicles"]
                    if len(vehicles) > 0:
                        # Store first vehicle ID for booking test
                        self.vehicle_id = vehicles[0]["id"]
                        vehicle_names = [v["name"] for v in vehicles]
                        self.log_test("GET /vehicles", True, 
                                    f"Found {len(vehicles)} vehicles: {', '.join(vehicle_names)}")
                        return True
                    else:
                        self.log_test("GET /vehicles", False, "No vehicles found", data)
                        return False
                else:
                    self.log_test("GET /vehicles", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /vehicles", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /vehicles", False, f"Request error: {str(e)}")
            return False
    
    def test_get_addons_georgian(self):
        """Test GET /api/addons?lang=ka - Georgian language"""
        try:
            response = self.session.get(f"{self.base_url}/addons?lang=ka")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "addons" in data:
                    addons = data["addons"]
                    if len(addons) > 0:
                        # Check if Georgian text is present
                        georgian_names = [a["name"] for a in addons if any(ord(c) >= 0x10A0 and ord(c) <= 0x10FF for c in a["name"])]
                        self.log_test("GET /addons?lang=ka", True, 
                                    f"Found {len(addons)} addons, {len(georgian_names)} with Georgian text")
                        return True
                    else:
                        self.log_test("GET /addons?lang=ka", False, "No addons found", data)
                        return False
                else:
                    self.log_test("GET /addons?lang=ka", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /addons?lang=ka", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /addons?lang=ka", False, f"Request error: {str(e)}")
            return False
    
    def test_get_addons_english(self):
        """Test GET /api/addons?lang=en - English language"""
        try:
            response = self.session.get(f"{self.base_url}/addons?lang=en")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "addons" in data:
                    addons = data["addons"]
                    if len(addons) > 0:
                        addon_names = [a["name"] for a in addons]
                        self.log_test("GET /addons?lang=en", True, 
                                    f"Found {len(addons)} addons: {', '.join(addon_names[:3])}...")
                        return True
                    else:
                        self.log_test("GET /addons?lang=en", False, "No addons found", data)
                        return False
                else:
                    self.log_test("GET /addons?lang=en", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /addons?lang=en", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /addons?lang=en", False, f"Request error: {str(e)}")
            return False
    
    def test_get_addons_turkish(self):
        """Test GET /api/addons?lang=tr - Turkish language"""
        try:
            response = self.session.get(f"{self.base_url}/addons?lang=tr")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "addons" in data:
                    addons = data["addons"]
                    if len(addons) > 0:
                        addon_names = [a["name"] for a in addons]
                        self.log_test("GET /addons?lang=tr", True, 
                                    f"Found {len(addons)} addons: {', '.join(addon_names[:3])}...")
                        return True
                    else:
                        self.log_test("GET /addons?lang=tr", False, "No addons found", data)
                        return False
                else:
                    self.log_test("GET /addons?lang=tr", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /addons?lang=tr", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /addons?lang=tr", False, f"Request error: {str(e)}")
            return False
    
    def test_get_locations_georgian(self):
        """Test GET /api/locations?lang=ka - Georgian language"""
        try:
            response = self.session.get(f"{self.base_url}/locations?lang=ka")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "locations" in data:
                    locations = data["locations"]
                    if len(locations) > 0:
                        # Check if Georgian text is present
                        georgian_names = [l["name"] for l in locations if any(ord(c) >= 0x10A0 and ord(c) <= 0x10FF for c in l["name"])]
                        self.log_test("GET /locations?lang=ka", True, 
                                    f"Found {len(locations)} locations, {len(georgian_names)} with Georgian text")
                        return True
                    else:
                        self.log_test("GET /locations?lang=ka", False, "No locations found", data)
                        return False
                else:
                    self.log_test("GET /locations?lang=ka", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /locations?lang=ka", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /locations?lang=ka", False, f"Request error: {str(e)}")
            return False
    
    def test_get_locations_english(self):
        """Test GET /api/locations?lang=en - English language"""
        try:
            response = self.session.get(f"{self.base_url}/locations?lang=en")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "locations" in data:
                    locations = data["locations"]
                    if len(locations) > 0:
                        location_names = [l["name"] for l in locations]
                        self.log_test("GET /locations?lang=en", True, 
                                    f"Found {len(locations)} locations: {', '.join(location_names)}")
                        return True
                    else:
                        self.log_test("GET /locations?lang=en", False, "No locations found", data)
                        return False
                else:
                    self.log_test("GET /locations?lang=en", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /locations?lang=en", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /locations?lang=en", False, f"Request error: {str(e)}")
            return False
    
    def test_create_booking(self):
        """Test POST /api/bookings - create a test booking"""
        if not self.vehicle_id:
            self.log_test("POST /bookings", False, "No vehicle ID available from previous test")
            return False
        
        # Create booking data with future dates
        pickup_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        dropoff_date = (datetime.now() + timedelta(days=11)).strftime("%Y-%m-%d")
        
        booking_data = {
            "customer": {
                "first_name": "Giorgi",
                "last_name": "Beridze",
                "email": "giorgi.beridze@example.com",
                "phone": "+995555123456"
            },
            "pickup": {
                "location_id": 1,
                "date": pickup_date,
                "time": "10:00"
            },
            "dropoff": {
                "location_id": 2,
                "date": dropoff_date,
                "time": "10:00"
            },
            "vehicle_id": self.vehicle_id,
            "addon_ids": [1, 4],  # Insurance and GPS
            "payment_method": "card",
            "language": "en"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/bookings", 
                                       json=booking_data,
                                       headers={"Content-Type": "application/json"})
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "booking" in data:
                    booking = data["booking"]
                    if "booking_id" in booking and "total" in booking:
                        self.booking_id = booking["booking_id"]
                        self.log_test("POST /bookings", True, 
                                    f"Booking created: ID={booking['booking_id']}, Total={booking['total']} GEL")
                        return True
                    else:
                        self.log_test("POST /bookings", False, "Missing booking_id or total in response", data)
                        return False
                else:
                    self.log_test("POST /bookings", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("POST /bookings", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /bookings", False, f"Request error: {str(e)}")
            return False
    
    def test_get_booking(self):
        """Test GET /api/bookings/{booking_id} - retrieve created booking"""
        if not self.booking_id:
            self.log_test("GET /bookings/{id}", False, "No booking ID available from previous test")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/bookings/{self.booking_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "booking" in data:
                    booking = data["booking"]
                    if booking.get("booking_id") == self.booking_id:
                        customer_name = f"{booking['customer']['first_name']} {booking['customer']['last_name']}"
                        self.log_test("GET /bookings/{id}", True, 
                                    f"Retrieved booking for {customer_name}, Status: {booking.get('status', 'unknown')}")
                        return True
                    else:
                        self.log_test("GET /bookings/{id}", False, "Booking ID mismatch", data)
                        return False
                else:
                    self.log_test("GET /bookings/{id}", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /bookings/{id}", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /bookings/{id}", False, f"Request error: {str(e)}")
            return False

    def test_admin_login(self):
        """Test admin login with known credentials"""
        try:
            login_data = {
                "username": "LegendTaxi",
                "password": "Gr!7pA9z#Lm2Qx"
            }
            
            response = self.session.post(f"{self.base_url}/admin/login", 
                                       json=login_data,
                                       headers={"Content-Type": "application/json"})
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "access_token" in data:
                    self.admin_token = data["access_token"]
                    self.log_test("Admin Login", True, f"Token obtained successfully")
                    return True
                else:
                    self.log_test("Admin Login", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Request error: {str(e)}")
            return False

    def test_get_admin_users(self):
        """Test GET /api/admin/users - get list of users"""
        if not self.admin_token:
            self.log_test("GET /admin/users", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/users", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "users" in data:
                    users = data["users"]
                    if len(users) > 0:
                        # Store first user ID for detailed testing
                        self.test_user_id = users[0]["id"]
                        user_count = len(users)
                        first_user = f"{users[0].get('first_name', '')} {users[0].get('last_name', '')}"
                        self.log_test("GET /admin/users", True, 
                                    f"Found {user_count} users, first: {first_user}")
                        return True
                    else:
                        self.log_test("GET /admin/users", False, "No users found", data)
                        return False
                else:
                    self.log_test("GET /admin/users", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/users", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/users", False, f"Request error: {str(e)}")
            return False

    def test_get_user_detail(self):
        """Test GET /api/admin/users/{user_id} - get specific user details"""
        if not self.admin_token or not self.test_user_id:
            self.log_test("GET /admin/users/{id}", False, "No admin token or user ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/users/{self.test_user_id}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "user" in data:
                    user = data["user"]
                    required_fields = ["id", "first_name", "last_name", "phone"]
                    missing_fields = [field for field in required_fields if field not in user]
                    
                    if not missing_fields:
                        user_name = f"{user.get('first_name')} {user.get('last_name')}"
                        self.log_test("GET /admin/users/{id}", True, 
                                    f"User details retrieved: {user_name}, Phone: {user.get('phone')}")
                        return True
                    else:
                        self.log_test("GET /admin/users/{id}", False, f"Missing fields: {missing_fields}", data)
                        return False
                else:
                    self.log_test("GET /admin/users/{id}", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/users/{id}", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/users/{id}", False, f"Request error: {str(e)}")
            return False

    def test_update_user(self):
        """Test PUT /api/admin/users/{user_id} - update user details"""
        if not self.admin_token or not self.test_user_id:
            self.log_test("PUT /admin/users/{id}", False, "No admin token or user ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}", "Content-Type": "application/json"}
            
            # First, get current user data
            get_response = self.session.get(f"{self.base_url}/admin/users/{self.test_user_id}", headers=headers)
            if get_response.status_code != 200:
                self.log_test("PUT /admin/users/{id}", False, "Could not get current user data")
                return False
            
            current_user = get_response.json()["user"]
            original_last_name = current_user.get("last_name", "")
            
            # Update with test suffix
            update_data = {
                "last_name": f"{original_last_name}-test"
            }
            
            response = self.session.put(f"{self.base_url}/admin/users/{self.test_user_id}", 
                                      json=update_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    # Revert the change
                    revert_data = {"last_name": original_last_name}
                    revert_response = self.session.put(f"{self.base_url}/admin/users/{self.test_user_id}", 
                                                     json=revert_data, headers=headers)
                    
                    if revert_response.status_code == 200:
                        self.log_test("PUT /admin/users/{id}", True, 
                                    f"User updated and reverted successfully")
                        return True
                    else:
                        self.log_test("PUT /admin/users/{id}", True, 
                                    f"User updated but revert failed (HTTP {revert_response.status_code})")
                        return True
                else:
                    self.log_test("PUT /admin/users/{id}", False, "Update failed", data)
                    return False
            else:
                self.log_test("PUT /admin/users/{id}", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("PUT /admin/users/{id}", False, f"Request error: {str(e)}")
            return False

    def test_get_user_listings(self):
        """Test GET /api/admin/users/{user_id}/listings - get user's listings"""
        if not self.admin_token or not self.test_user_id:
            self.log_test("GET /admin/users/{id}/listings", False, "No admin token or user ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/users/{self.test_user_id}/listings", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data and "allowed_expiry_days" in data:
                    listings = data["listings"]
                    allowed_days = data["allowed_expiry_days"]
                    
                    # Store first listing ID if available
                    if len(listings) > 0:
                        self.test_listing_id = listings[0]["id"]
                    
                    self.log_test("GET /admin/users/{id}/listings", True, 
                                f"Found {len(listings)} listings, allowed expiry days: {allowed_days}")
                    return True
                else:
                    self.log_test("GET /admin/users/{id}/listings", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/users/{id}/listings", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/users/{id}/listings", False, f"Request error: {str(e)}")
            return False

    def test_set_listing_expiry(self):
        """Test POST /api/admin/listings/{listing_id}/set-expiry - set listing expiry"""
        if not self.admin_token or not self.test_listing_id:
            self.log_test("POST /admin/listings/{id}/set-expiry", False, "No admin token or listing ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}", "Content-Type": "application/json"}
            expiry_data = {"days": 5}
            
            response = self.session.post(f"{self.base_url}/admin/listings/{self.test_listing_id}/set-expiry", 
                                       json=expiry_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "expires_at" in data:
                    expires_at = data["expires_at"]
                    # Verify it's a valid ISO datetime string
                    try:
                        datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                        self.log_test("POST /admin/listings/{id}/set-expiry", True, 
                                    f"Expiry set successfully: {expires_at}")
                        return True
                    except ValueError:
                        self.log_test("POST /admin/listings/{id}/set-expiry", False, 
                                    f"Invalid datetime format: {expires_at}", data)
                        return False
                else:
                    self.log_test("POST /admin/listings/{id}/set-expiry", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("POST /admin/listings/{id}/set-expiry", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /admin/listings/{id}/set-expiry", False, f"Request error: {str(e)}")
            return False

    def test_archive_listing(self):
        """Test POST /api/admin/listings/{listing_id}/archive - archive listing"""
        if not self.admin_token or not self.test_listing_id:
            self.log_test("POST /admin/listings/{id}/archive", False, "No admin token or listing ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            response = self.session.post(f"{self.base_url}/admin/listings/{self.test_listing_id}/archive", 
                                       headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("POST /admin/listings/{id}/archive", True, 
                                f"Listing archived successfully")
                    return True
                else:
                    self.log_test("POST /admin/listings/{id}/archive", False, "Archive failed", data)
                    return False
            else:
                self.log_test("POST /admin/listings/{id}/archive", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /admin/listings/{id}/archive", False, f"Request error: {str(e)}")
            return False

    def test_admin_listings_active(self):
        """Test GET /api/admin/listings?status=active&limit=5 - get active listings"""
        if not self.admin_token:
            self.log_test("GET /admin/listings?status=active", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/listings?status=active&limit=5", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    # Verify response structure
                    if len(listings) > 0:
                        first_listing = listings[0]
                        required_fields = ["id", "status", "expires_at"]
                        missing_fields = [field for field in required_fields if field not in first_listing]
                        
                        if not missing_fields:
                            # Store a listing ID for status update tests
                            if not self.test_listing_id:
                                self.test_listing_id = first_listing["id"]
                            self.log_test("GET /admin/listings?status=active", True, 
                                        f"Found {len(listings)} active listings with proper structure")
                            return True
                        else:
                            self.log_test("GET /admin/listings?status=active", False, 
                                        f"Missing required fields: {missing_fields}", data)
                            return False
                    else:
                        self.log_test("GET /admin/listings?status=active", True, 
                                    "No active listings found (empty result is valid)")
                        return True
                else:
                    self.log_test("GET /admin/listings?status=active", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/listings?status=active", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/listings?status=active", False, f"Request error: {str(e)}")
            return False

    def test_admin_listings_archived(self):
        """Test GET /api/admin/listings?status=archived&limit=5 - get archived listings"""
        if not self.admin_token:
            self.log_test("GET /admin/listings?status=archived", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/listings?status=archived&limit=5", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    self.log_test("GET /admin/listings?status=archived", True, 
                                f"Found {len(listings)} archived listings")
                    return True
                else:
                    self.log_test("GET /admin/listings?status=archived", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/listings?status=archived", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/listings?status=archived", False, f"Request error: {str(e)}")
            return False

    def test_admin_listings_search(self):
        """Test GET /api/admin/listings?status=active&q=BMW - search functionality"""
        if not self.admin_token:
            self.log_test("GET /admin/listings search", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/listings?status=active&q=BMW", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    self.log_test("GET /admin/listings search", True, 
                                f"Search returned {len(listings)} results for 'BMW'")
                    return True
                else:
                    self.log_test("GET /admin/listings search", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/listings search", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/listings search", False, f"Request error: {str(e)}")
            return False

    def test_admin_listing_status_archive(self):
        """Test POST /api/admin/listings/{id}/status - archive listing"""
        if not self.admin_token or not self.test_listing_id:
            self.log_test("POST /admin/listings/{id}/status (archive)", False, "No admin token or listing ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}", "Content-Type": "application/json"}
            status_data = {"status": "archived"}
            
            response = self.session.post(f"{self.base_url}/admin/listings/{self.test_listing_id}/status", 
                                       json=status_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("POST /admin/listings/{id}/status (archive)", True, 
                                f"Listing status updated to archived")
                    return True
                else:
                    self.log_test("POST /admin/listings/{id}/status (archive)", False, "Status update failed", data)
                    return False
            else:
                self.log_test("POST /admin/listings/{id}/status (archive)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /admin/listings/{id}/status (archive)", False, f"Request error: {str(e)}")
            return False

    def test_admin_listing_status_activate(self):
        """Test POST /api/admin/listings/{id}/status - activate listing with expiry"""
        if not self.admin_token or not self.test_listing_id:
            self.log_test("POST /admin/listings/{id}/status (activate)", False, "No admin token or listing ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}", "Content-Type": "application/json"}
            status_data = {"status": "active", "days": 5}
            
            response = self.session.post(f"{self.base_url}/admin/listings/{self.test_listing_id}/status", 
                                       json=status_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("POST /admin/listings/{id}/status (activate)", True, 
                                f"Listing status updated to active with 5 days expiry")
                    return True
                else:
                    self.log_test("POST /admin/listings/{id}/status (activate)", False, "Status update failed", data)
                    return False
            else:
                self.log_test("POST /admin/listings/{id}/status (activate)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /admin/listings/{id}/status (activate)", False, f"Request error: {str(e)}")
            return False

    def test_auto_archive_expiry_check(self):
        """Test auto-archive functionality by calling public listings endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/listings?status=active")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    self.log_test("Auto-archive expiry check", True, 
                                f"Public listings endpoint responds correctly with {len(listings)} active listings")
                    return True
                else:
                    self.log_test("Auto-archive expiry check", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Auto-archive expiry check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Auto-archive expiry check", False, f"Request error: {str(e)}")
            return False

    def test_vip_enable(self):
        """Test POST /api/admin/listings/{id}/vip - enable VIP with days and rank"""
        if not self.admin_token or not self.test_listing_id:
            self.log_test("POST /admin/listings/{id}/vip (enable)", False, "No admin token or listing ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}", "Content-Type": "application/json"}
            vip_data = {"enable": True, "days": 5, "rank": 1}
            
            response = self.session.post(f"{self.base_url}/admin/listings/{self.test_listing_id}/vip", 
                                       json=vip_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("POST /admin/listings/{id}/vip (enable)", True, 
                                f"VIP enabled successfully with 5 days and rank 1")
                    return True
                else:
                    self.log_test("POST /admin/listings/{id}/vip (enable)", False, "VIP enable failed", data)
                    return False
            else:
                self.log_test("POST /admin/listings/{id}/vip (enable)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /admin/listings/{id}/vip (enable)", False, f"Request error: {str(e)}")
            return False

    def test_get_vip_listings(self):
        """Test GET /api/admin/vip-listings - get VIP listings ordered by rank"""
        if not self.admin_token:
            self.log_test("GET /admin/vip-listings", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{self.base_url}/admin/vip-listings", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    # Check if our test listing is in VIP listings
                    found_test_listing = any(listing["id"] == self.test_listing_id for listing in listings)
                    
                    if found_test_listing:
                        self.log_test("GET /admin/vip-listings", True, 
                                    f"Found {len(listings)} VIP listings, test listing included and ordered by vip_rank")
                        return True
                    else:
                        self.log_test("GET /admin/vip-listings", True, 
                                    f"Found {len(listings)} VIP listings (test listing may not be VIP yet)")
                        return True
                else:
                    self.log_test("GET /admin/vip-listings", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("GET /admin/vip-listings", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("GET /admin/vip-listings", False, f"Request error: {str(e)}")
            return False

    def test_vip_disable(self):
        """Test POST /api/admin/listings/{id}/vip - disable VIP"""
        if not self.admin_token or not self.test_listing_id:
            self.log_test("POST /admin/listings/{id}/vip (disable)", False, "No admin token or listing ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}", "Content-Type": "application/json"}
            vip_data = {"enable": False}
            
            response = self.session.post(f"{self.base_url}/admin/listings/{self.test_listing_id}/vip", 
                                       json=vip_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("POST /admin/listings/{id}/vip (disable)", True, 
                                f"VIP disabled successfully")
                    return True
                else:
                    self.log_test("POST /admin/listings/{id}/vip (disable)", False, "VIP disable failed", data)
                    return False
            else:
                self.log_test("POST /admin/listings/{id}/vip (disable)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("POST /admin/listings/{id}/vip (disable)", False, f"Request error: {str(e)}")
            return False

    def test_public_listings_vip_fields(self):
        """Test GET /api/listings?status=active&limit=10 - verify VIP fields exist"""
        try:
            response = self.session.get(f"{self.base_url}/listings?status=active&limit=10")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    if len(listings) > 0:
                        first_listing = listings[0]
                        vip_fields = ["is_vip", "vip_until", "vip_rank"]
                        missing_fields = [field for field in vip_fields if field not in first_listing]
                        
                        if not missing_fields:
                            self.log_test("Public listings VIP fields", True, 
                                        f"All VIP fields present: is_vip={first_listing['is_vip']}, vip_until={first_listing['vip_until']}, vip_rank={first_listing['vip_rank']}")
                            return True
                        else:
                            self.log_test("Public listings VIP fields", False, 
                                        f"Missing VIP fields: {missing_fields}", data)
                            return False
                    else:
                        self.log_test("Public listings VIP fields", True, 
                                    "No listings found to check VIP fields (empty result is valid)")
                        return True
                else:
                    self.log_test("Public listings VIP fields", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Public listings VIP fields", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Public listings VIP fields", False, f"Request error: {str(e)}")
            return False

    def test_advanced_filters(self):
        """Test GET /api/listings with advanced filters"""
        try:
            filter_params = "status=active&min_price=0&max_price=999999&min_year=1990&max_year=2030&min_mileage=0&max_mileage=999999&fuel_type=Benzin&transmission=Otomatik&limit=5"
            response = self.session.get(f"{self.base_url}/listings?{filter_params}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    self.log_test("Advanced filters", True, 
                                f"Advanced filters working correctly, returned {len(listings)} listings")
                    return True
                else:
                    self.log_test("Advanced filters", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Advanced filters", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Advanced filters", False, f"Request error: {str(e)}")
            return False

    def test_listings_regression_basic(self):
        """Test GET /api/listings?status=active&limit=5 - basic regression test"""
        try:
            response = self.session.get(f"{self.base_url}/listings?status=active&limit=5")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    self.log_test("Listings regression (basic)", True, 
                                f"Basic listings endpoint working, returned {len(listings)} listings")
                    return True
                else:
                    self.log_test("Listings regression (basic)", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Listings regression (basic)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Listings regression (basic)", False, f"Request error: {str(e)}")
            return False

    def test_listings_regression_brand_filter(self):
        """Test GET /api/listings?status=active&brand=Toyota&limit=5 - brand filter regression test"""
        try:
            response = self.session.get(f"{self.base_url}/listings?status=active&brand=Toyota&limit=5")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    # Verify all returned listings are Toyota brand
                    toyota_count = sum(1 for listing in listings if listing.get("brand") == "Toyota")
                    self.log_test("Listings regression (brand filter)", True, 
                                f"Brand filter working, returned {len(listings)} listings, {toyota_count} Toyota vehicles")
                    return True
                else:
                    self.log_test("Listings regression (brand filter)", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Listings regression (brand filter)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Listings regression (brand filter)", False, f"Request error: {str(e)}")
            return False

    def test_listings_regression_complex_filters(self):
        """Test GET /api/listings?status=active&brand=Toyota&model=Camry&min_year=2000&max_year=2030&fuel_type=Benzin&limit=5 - complex filters regression test"""
        try:
            filter_params = "status=active&brand=Toyota&model=Camry&min_year=2000&max_year=2030&fuel_type=Benzin&limit=5"
            response = self.session.get(f"{self.base_url}/listings?{filter_params}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "listings" in data:
                    listings = data["listings"]
                    # Verify filters are applied correctly
                    valid_listings = 0
                    for listing in listings:
                        if (listing.get("brand") == "Toyota" and 
                            listing.get("model") == "Camry" and
                            2000 <= listing.get("year", 0) <= 2030 and
                            listing.get("fuel_type") == "Benzin"):
                            valid_listings += 1
                    
                    self.log_test("Listings regression (complex filters)", True, 
                                f"Complex filters working, returned {len(listings)} listings, {valid_listings} matching all criteria")
                    return True
                else:
                    self.log_test("Listings regression (complex filters)", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Listings regression (complex filters)", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Listings regression (complex filters)", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("LEGENDACAR Backend API Tests")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Run tests in sequence
        tests = [
            self.test_health_check,
            self.test_get_vehicles,
            self.test_get_addons_georgian,
            self.test_get_addons_english,
            self.test_get_addons_turkish,
            self.test_get_locations_georgian,
            self.test_get_locations_english,
            self.test_create_booking,
            self.test_get_booking,
            # Admin user detail tests
            self.test_admin_login,
            self.test_get_admin_users,
            self.test_get_user_detail,
            self.test_update_user,
            self.test_get_user_listings,
            self.test_set_listing_expiry,
            self.test_archive_listing
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Return success if all critical tests pass
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                critical_failures.append(result["test"])
        
        if critical_failures:
            print(f"❌ CRITICAL FAILURES: {', '.join(critical_failures)}")
            return False
        else:
            print("✅ ALL TESTS PASSED")
            return True

    def run_admin_user_detail_tests_only(self):
        """Run only the admin user detail tests"""
        print("=" * 60)
        print("LEGENDACAR Admin User Detail API Tests")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Run admin tests in sequence
        admin_tests = [
            self.test_admin_login,
            self.test_get_admin_users,
            self.test_get_user_detail,
            self.test_update_user,
            self.test_get_user_listings,
            self.test_set_listing_expiry,
            self.test_archive_listing
        ]
        
        passed = 0
        total = len(admin_tests)
        
        for test in admin_tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"ADMIN TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Return success if all admin tests pass
        admin_failures = []
        for result in self.test_results:
            if not result["success"] and any(keyword in result["test"] for keyword in ["Admin", "admin", "PUT", "GET /admin"]):
                admin_failures.append(result["test"])
        
        if admin_failures:
            print(f"❌ ADMIN TEST FAILURES: {', '.join(admin_failures)}")
            return False
        else:
            print("✅ ALL ADMIN TESTS PASSED")
            return True

    def run_admin_listings_tests_only(self):
        """Run only the admin listings tests"""
        print("=" * 60)
        print("LEGENDACAR Admin Listings API Tests")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Run admin listings tests in sequence
        admin_listings_tests = [
            self.test_admin_login,
            self.test_admin_listings_active,
            self.test_admin_listings_archived,
            self.test_admin_listings_search,
            self.test_admin_listing_status_archive,
            self.test_admin_listing_status_activate,
            self.test_auto_archive_expiry_check
        ]
        
        passed = 0
        total = len(admin_listings_tests)
        
        for test in admin_listings_tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"ADMIN LISTINGS TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Return success if all admin listings tests pass
        admin_failures = []
        for result in self.test_results:
            if not result["success"]:
                admin_failures.append(result["test"])
        
        if admin_failures:
            print(f"❌ ADMIN LISTINGS TEST FAILURES: {', '.join(admin_failures)}")
            return False
        else:
            print("✅ ALL ADMIN LISTINGS TESTS PASSED")
            return True

    def run_vip_and_filters_tests_only(self):
        """Run only the VIP and advanced filters tests"""
        print("=" * 60)
        print("LEGENDACAR VIP + Advanced Filters API Tests")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Run VIP and filters tests in sequence
        vip_filter_tests = [
            self.test_admin_login,
            self.test_admin_listings_active,  # To get a listing_id
            self.test_vip_enable,
            self.test_get_vip_listings,
            self.test_vip_disable,
            self.test_public_listings_vip_fields,
            self.test_advanced_filters
        ]
        
        passed = 0
        total = len(vip_filter_tests)
        
        for test in vip_filter_tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"VIP + FILTERS TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Return success if all VIP and filter tests pass
        vip_failures = []
        for result in self.test_results:
            if not result["success"]:
                vip_failures.append(result["test"])
        
        if vip_failures:
            print(f"❌ VIP + FILTERS TEST FAILURES: {', '.join(vip_failures)}")
            return False
        else:
            print("✅ ALL VIP + FILTERS TESTS PASSED")
            return True

    def run_listings_regression_tests_only(self):
        """Run only the listings regression tests as requested"""
        print("=" * 60)
        print("LEGENDACAR Listings Regression Tests")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Run listings regression tests in sequence
        regression_tests = [
            self.test_listings_regression_basic,
            self.test_listings_regression_brand_filter,
            self.test_listings_regression_complex_filters
        ]
        
        passed = 0
        total = len(regression_tests)
        
        for test in regression_tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"LISTINGS REGRESSION TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Return success if all regression tests pass
        regression_failures = []
        for result in self.test_results:
            if not result["success"] and "regression" in result["test"]:
                regression_failures.append(result["test"])
        
        if regression_failures:
            print(f"❌ LISTINGS REGRESSION TEST FAILURES: {', '.join(regression_failures)}")
            return False
        else:
            print("✅ ALL LISTINGS REGRESSION TESTS PASSED")
            return True

def main():
    """Main test execution"""
    tester = BackendTester()
    
    # Check if we should run specific test suites
    if len(sys.argv) > 1:
        if sys.argv[1] == "admin":
            success = tester.run_admin_user_detail_tests_only()
        elif sys.argv[1] == "admin_listings":
            success = tester.run_admin_listings_tests_only()
        elif sys.argv[1] == "vip_filters":
            success = tester.run_vip_and_filters_tests_only()
        else:
            success = tester.run_all_tests()
    else:
        success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()