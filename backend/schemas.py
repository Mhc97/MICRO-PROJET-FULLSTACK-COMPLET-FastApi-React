from pydantic import BaseModel, EmailStr, Field, field_validator

class ContactBase(BaseModel):
    nom: str = Field(..., min_length=2, max_length=50)
    telephone: str = Field(..., min_length=8, max_length=20)
    email: str = ""
    # 👉 En résumé : field_validator = une fonction de contrôle/nettoyage appliquée automatiquement à un champ Pydantic.
    @field_validator('telephone')
    def validate_telephone(cls, v):
        if not v.replace("", "").replace("-", "").replace("+", "").isdigit():
            raise ValueError('Téléphone invalide')
        return v
    
class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    
    class Config:
        from_attributes = True
        