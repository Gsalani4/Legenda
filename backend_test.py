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
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("MGZAVROBANI Car Rental Backend API Tests")
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
            self.test_get_booking
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

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()