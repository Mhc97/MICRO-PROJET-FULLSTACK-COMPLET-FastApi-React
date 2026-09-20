from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    
def test_create_contact():
    response = client.post("/contacts", json={
        "nom": "Test",
        "telephone": "0600000000",
        "email": "Test@test.com"
    })
    assert response.status_code == 200
    assert response.json()["nom"] == "Test"

def test_get_contacts():
    response = client.get("/contacts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)    