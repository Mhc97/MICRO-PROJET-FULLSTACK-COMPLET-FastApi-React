from sqlalchemy import Column, Integer, String
from database import Base

class ContactDB(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True)
    telephone = Column(String)
    email = Column(String, index=True)
    