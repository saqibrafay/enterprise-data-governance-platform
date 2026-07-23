from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class RoleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    # from_attributes=True lets Pydantic read values from SQLAlchemy ORM objects
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role_id: int
    role: RoleOut      # nested role object — frontend uses role.name
    created_at: datetime
