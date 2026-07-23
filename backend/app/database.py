from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

engine = create_engine(settings.database_url)

# Each request gets its own session; autocommit/autoflush off for explicit control
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """SQLAlchemy declarative base — all models inherit from this."""
    pass


def get_db():
    """FastAPI dependency that yields a DB session and closes it when the request ends."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
