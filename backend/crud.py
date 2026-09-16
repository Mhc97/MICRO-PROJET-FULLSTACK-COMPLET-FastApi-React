from sqlalchemy.orm import Session
import models
import schemas

def get_contacts(db: Session):
    return db.query(models.ContactDB).all()

def get_contact(db: Session, contact_id: int):
    return db.query(models.ContactDB).filter(
        models.ContactDB.id == contact_id
    ).first()
    
def create_contact(db: Session, contact: schemas.ContactCreate):
    db_contact = models.ContactDB(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def update_contact(db: Session, contact_id: int, contact: schemas.ContactCreate):
    db_contact = get_contact(db, contact_id)
    if db_contact:
        for key, value in contact.dict().items():
            setattr(db_contact, key, value)
        db.commit()
        db.refresh(db_contact)
    return db_contact

def delete_contact(db: Session, contact_id: int):
    db_contact = get_contact(db, contact_id)
    if db_contact:
        db.delete(db_contact)
        db.commit()
    return db_contact