from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.schemas.auth import Token
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # New users always start as Viewer — an Admin can promote them later
    viewer_role = db.query(Role).filter(Role.name == "Viewer").first()
    if not viewer_role:
        raise HTTPException(status_code=500, detail="Viewer role missing — did the migration run?")

    user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role_id=viewer_role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    # Intentionally vague error — don't reveal whether the email exists
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    # JWT payload: `sub` (subject) = user ID as string — standard JWT convention
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}
