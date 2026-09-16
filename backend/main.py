from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import time

import models, schemas, crud
from database import engine, get_db

# Créer les tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Contacts API", version="1.0")

# CORS pour React

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pour montrer que sa fonctionner ou pas

niveau = {
    "Niveau 1": "✅ Ça marche (tu es ici)",
    "Niveau 2": "🟡 Ça marche BIEN (UX correcte)",
    "Niveau 3": "🟠 Ça marche PARTOUT (robuste)",
    "Niveau 4": "🔴 Ça marche COMME UN PRO (qualité)",
    "Niveau 5": "🏆 C'est DÉPLOYÉ (accessible au monde)"
}

# Décorateur Maison : mesure le temps d'exécution
def timer(fonction):
    def wrapper(*args, **kwargs):
        debut = time.time()
        resultat = fonction(*args, **kwargs)
        fin = time.time()
        print(f"⏱️ {fonction.__name__} : {fin - debut:.4f}s")
        return resultat
    return wrapper

# 🌐 ROUTES

@app.get("/")
def home():
    return {"message":"Api Contacts fonctionne 😊"}

@app.get("/contacts", response_model=List[schemas.Contact])
@timer
def get_contacts(db: Session = Depends(get_db)):
    return crud.get_contacts(db)

@app.get("/contacts/{contact_id}", response_model=schemas.Contact)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = crud.get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact non trouvé")
    return contact

@app.post("/contacts", response_model=schemas.Contact)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_contact(db, contact)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/contacts/{contact_id}", response_model=schemas.Contact)
def update_contact(
    contact_id: int,
    contact: schemas.ContactCreate,
    db: Session = Depends(get_db)
):
    
    updated = crud.update_contact(db, contact_id, contact)
    if not updated:
        raise HTTPException(status_code=404, detail="Contatc non trouvé")
    return updated

@app.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_contact(db, contact_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contact non trouvé")
    return {"message":f"Contact {contact_id} supprimé"}
