"""
Configuration Management
Loads settings from environment variables or defaults
"""

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # JWT
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:8000",
        "http://localhost:3000",
        "http://127.0.0.1:8000"
    ]
    
    # Data Paths
    DATA_DIR: str = "../data"
    TENANTS_FILE: str = "../data/tenants.json"
    
    # Exchange Rates (Reference)
    THB_TO_USD: float = 35.0
    THB_TO_EUR: float = 38.0
    
    # Security
    BCRYPT_ROUNDS: int = 12
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

