import os
from typing import Dict, Any

class Config:
    """Configuration class for the application"""
    
    # Database Configuration
    DATABASE_CONFIG: Dict[str, Any] = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'database': os.getenv('DB_NAME', 'weave'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'port': int(os.getenv('DB_PORT', 3306))
    }
    
    # API Configuration
    GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY', 'AIzaSyDkC3uecLUthMZ2VI-0oqBUFW4QLy_XtvI')
    
    # Server Configuration
    HOST: str = os.getenv('HOST', '0.0.0.0')
    PORT: int = int(os.getenv('PORT', 8000))
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # CORS Configuration
    CORS_ORIGINS: list = os.getenv('CORS_ORIGINS', '*').split(',')
    
    @classmethod
    def get_database_url(cls) -> str:
        """Get database connection URL"""
        config = cls.DATABASE_CONFIG
        return f"mysql://{config['user']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
