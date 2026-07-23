from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # pydantic-settings reads these from the .env file automatically
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30


# Single shared instance — import `settings` everywhere instead of re-instantiating
settings = Settings()
