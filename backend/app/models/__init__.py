# Import all models here so Alembic's env.py sees every table in Base.metadata
# when it does `import app.models`.
from app.models.role import Role  # noqa: F401
from app.models.user import User  # noqa: F401
