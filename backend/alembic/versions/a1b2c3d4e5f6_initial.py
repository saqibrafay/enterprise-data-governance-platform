"""Initial migration: create roles and users tables, seed default roles

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2026-07-22
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy import String, table, column

revision = "a1b2c3d4e5f6"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index("ix_roles_id", "roles", ["id"])

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("role_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["role_id"], ["roles.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"])

    # Seed the four RBAC roles the application expects at startup
    roles_table = table("roles", column("name", String))
    op.bulk_insert(
        roles_table,
        [
            {"name": "Admin"},
            {"name": "Maker"},
            {"name": "Checker"},
            {"name": "Viewer"},
        ],
    )


def downgrade() -> None:
    op.drop_table("users")
    op.drop_table("roles")
