from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.core.security import decode_access_token

# HTTPBearer extracts the token from the "Authorization: Bearer <token>" header
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Reusable dependency: decodes the JWT and returns the matching User row."""
    payload = decode_access_token(credentials.credentials)

    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def require_role(allowed_roles: List[str]):
    """
    Dependency factory — call it with the roles that may access an endpoint.
    Example: `Depends(require_role(["Admin", "Maker"]))`

    Returns a dependency function that raises 403 if the user's role isn't listed.
    The inner function also depends on get_current_user, so auth is checked first.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Allowed roles: {allowed_roles}",
            )
        return current_user

    return role_checker
