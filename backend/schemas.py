from pydantic import BaseModel

class ContactBase(BaseModel):
    nom: str
    telephone: str
    email: str = ""
    
class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    
    class Config:
        from_attributes = True
        