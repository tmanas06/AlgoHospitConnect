from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    environment: str = Field("development", alias="ENVIRONMENT")
    cors_origins: str = Field(
        "http://localhost:5173,http://127.0.0.1:5173", alias="CORS_ORIGINS"
    )
    algorand_network: str = Field("testnet", alias="ALGORAND_NETWORK")
    algod_url: str = Field("https://testnet-api.algonode.cloud", alias="ALGOD_URL")
    indexer_url: str = Field(
        "https://testnet-idx.algonode.cloud", alias="INDEXER_URL"
    )
    algod_token: str = Field("", alias="ALGOD_TOKEN")

    class Config:
        case_sensitive = False
        env_file = ".env"


settings = Settings()


