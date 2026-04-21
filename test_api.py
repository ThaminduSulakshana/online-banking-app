import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8080/api"

def make_request(url, data=None, headers=None):
    if headers is None:
        headers = {}
    headers['Content-Type'] = 'application/json'
    
    req_data = None
    if data:
        req_data = json.dumps(data).encode('utf-8')
        
    req = urllib.request.Request(url, data=req_data, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

# 1. Register User
print("--- Registering User ---")
reg_data = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123",
    "role": []
}
status, text = make_request(f"{BASE_URL}/auth/register", data=reg_data)
print(status, text)

# 2. Login User
print("\n--- Logging in ---")
login_data = {
    "username": "testuser",
    "password": "password123"
}
status, text = make_request(f"{BASE_URL}/auth/login", data=login_data)
print(status)
token = ""
if status == 200:
    resp_json = json.loads(text)
    token = resp_json.get("token")
    print("Token received")
else:
    print("Login failed:", text)
    exit(1)

headers = {
    "Authorization": f"Bearer {token}"
}

# 3. Create Account
print("\n--- Creating Account ---")
acc_data = {
    "accountType": "SAVINGS",
    "initialBalance": 1000.0
}
status, text = make_request(f"{BASE_URL}/accounts/create", data=acc_data, headers=headers)
print(status, text)

# 4. Get Accounts
print("\n--- Getting My Accounts ---")
status, text = make_request(f"{BASE_URL}/accounts/my-accounts", headers=headers)
print(status, text)
