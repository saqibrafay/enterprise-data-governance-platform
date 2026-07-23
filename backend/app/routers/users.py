from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut
from app.core.rbac import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the profile of whoever is calling (any authenticated role)."""
    return current_user


@router.get("/", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    # require_role returns a dependency; the underscore name signals we only care about
    # the side-effect (403 if not Admin), not the returned user object
    _: User = Depends(require_role(["Admin"])),
):
    """Admin-only: returns every user in the system."""
    return db.query(User).all()
