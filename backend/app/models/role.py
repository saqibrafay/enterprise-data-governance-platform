from sqlalchemy import Column, Integer, String
from app.database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    # Valid values seeded by migration: Admin | Maker | Checker | Viewer
    name = Column(String, unique=True, nullable=False)
