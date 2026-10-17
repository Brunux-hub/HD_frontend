import urllib.request
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://localhost:8080"

def request(method, path, body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            status = res.status
            content = res.read().decode("utf-8")
            data = json.loads(content) if content else None
            return status, data
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        data = json.loads(content) if content else None
        return e.code, data

def run_tests():
    print("🐾 Starting Healthy Pets Backend Verification Tests...\n")
    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  ✅ [PASS] {name}")
        else:
            print(f"  ❌ [FAIL] {name} - {details}")

    # 1. Public endpoints
    s, data = request("GET", "/services")
    assert_test("GET /services (Public)", s == 200 and len(data) >= 4, f"Status: {s}, Data: {data}")

    s, data = request("GET", "/vaccine")
    assert_test("GET /vaccine (Public)", s == 200 and len(data) >= 2, f"Status: {s}")

    # 2. Authentication
    s, data = request("POST", "/auth/login", {"username": "admin", "password": "wrongpassword"})
    assert_test("POST /auth/login (Invalid Password -> 401)", s == 401, f"Status: {s}")

    s, data = request("POST", "/auth/login", {"username": "admin", "password": "password123"})
    admin_token = data.get("token") if data else None
    assert_test("POST /auth/login (Admin Login -> 200)", s == 200 and admin_token is not None, f"Status: {s}")

    s, data = request("POST", "/auth/login", {"username": "client_carlos", "password": "password123"})
    client_token = data.get("token") if data else None
    assert_test("POST /auth/login (Client Login -> 200)", s == 200 and client_token is not None, f"Status: {s}")

    # 3. GET /auth/me
    s, data = request("GET", "/auth/me", token=admin_token)
    assert_test("GET /auth/me (Admin Role)", s == 200 and data.get("role") == "ADMIN", f"Data: {data}")

    s, data = request("GET", "/auth/me", token=client_token)
    assert_test("GET /auth/me (Client Role)", s == 200 and data.get("role") == "CLIENT", f"Data: {data}")

    # 4. Domain Entities (Admin)
    s, data = request("GET", "/user", token=admin_token)
    assert_test("GET /user (Admin access)", s == 200 and len(data) >= 5, f"Status: {s}")

    s, data = request("GET", "/owner", token=admin_token)
    assert_test("GET /owner", s == 200 and len(data) >= 2, f"Status: {s}")

    s, data = request("GET", "/owner/dni/72849102", token=admin_token)
    assert_test("GET /owner/dni/:dni (Found Carlos)", s == 200 and data.get("names") == "Carlos", f"Data: {data}")

    s, data = request("GET", "/owner/me", token=client_token)
    assert_test("GET /owner/me (Client own profile)", s == 200 and data.get("names") == "Carlos", f"Data: {data}")

    s, data = request("GET", "/pet", token=admin_token)
    has_owner = bool(data and data[0].get("owner") and data[0].get("pet_gender"))
    assert_test("GET /pet (Has owner & pet_gender)", s == 200 and has_owner, f"First pet: {data[0] if data else None}")

    s, data = request("GET", "/veterinarian", token=admin_token)
    has_user_resp = bool(data and "user_response" in data[0])
    assert_test("GET /veterinarian (Has user_response)", s == 200 and has_user_resp, f"Vet: {data[0] if data else None}")

    s, data = request("GET", "/receptionist", token=admin_token)
    assert_test("GET /receptionist (Has user)", s == 200 and len(data) >= 1, f"Status: {s}")

    s, data = request("GET", "/appointment", token=admin_token)
    has_relations = bool(data and data[0].get("pet") and data[0].get("veterinarian"))
    assert_test("GET /appointment (Nested pet & vet)", s == 200 and has_relations, f"App: {data[0] if data else None}")

    s, data = request("GET", "/medical_history", token=admin_token)
    has_services_field = bool(data and "services" in data[0])
    assert_test("GET /medical_history (Has 'services' property)", s == 200 and has_services_field, f"MH: {data[0] if data else None}")

    s, data = request("GET", "/vaccination", token=admin_token)
    has_vac_history = bool(data and data[0].get("medical_history") and data[0].get("vaccine"))
    assert_test("GET /vaccination (Has medical_history & vaccine)", s == 200 and has_vac_history, f"Vac: {data[0] if data else None}")

    # 5. Reports
    s, data = request("GET", "/reports/completed-services", token=admin_token)
    assert_test("GET /reports/completed-services", s == 200 and len(data) >= 1, f"Count: {len(data) if data else 0}")

    s, data = request("GET", "/reports/appointments?status=CLOSED", token=admin_token)
    assert_test("GET /reports/appointments?status=CLOSED", s == 200 and all(a.get("status") == "CLOSED" for a in data), f"Status: {s}")

    # 6. Registration Flow
    import random
    rand_id = random.randint(1000, 9999)
    new_username = f"newuser_{rand_id}"
    new_dni = f"888{rand_id}"

    reg_payload = {
        "username": new_username,
        "password": "mypassword123",
        "dni": new_dni,
        "names": "Test Client",
        "last_names": "Registered Automated",
        "email": f"test_{rand_id}@test.com",
        "phone_number": "+51 911223344",
        "address": "Calle Prueba 789"
    }

    s, data = request("POST", "/auth/register", reg_payload)
    assert_test("POST /auth/register (Client Public Signup)", s == 201 and data.get("dni") == new_dni, f"Data: {data}")

    # Login with new account
    s, data = request("POST", "/auth/login", {"username": new_username, "password": "mypassword123"})
    new_token = data.get("token") if data else None
    assert_test("POST /auth/login (New Registered Client)", s == 200 and new_token is not None, f"Status: {s}")

    s, data = request("GET", "/owner/me", token=new_token)
    assert_test("GET /owner/me (New Client profile resolved)", s == 200 and data.get("dni") == new_dni, f"Data: {data}")

    # 7. Pet Creation (sending 'sex')
    pet_payload = {
        "id_owner": data.get("id_owner"),
        "name": "Boby",
        "species": "Canine",
        "race": "Beagle",
        "birthdate": "2023-04-10",
        "sex": "MALE",
        "weight": "14 kg"
    }
    s, pet_data = request("POST", "/pet", pet_payload, token=admin_token)
    assert_test("POST /pet (Using 'sex' field -> maps to pet_gender)", s == 201 and pet_data.get("pet_gender") == "MALE", f"Pet: {pet_data}")

    print(f"\n==========================================")
    print(f"📊 Test Results: {passed} / {total} Passed ({passed/total*100:.1f}%)")
    print(f"==========================================")

    if passed != total:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
