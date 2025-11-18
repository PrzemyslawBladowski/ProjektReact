import os
from datetime import timedelta
from pathlib import Path

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-product-very-long-random-string")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

DATABASE_URL = "sqlite:///./sincenet.db"

ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]

DEV_USERS_FILE = Path(__file__).parent / "dev_users.txt" 


ALLOWED_FILE_EXTENSIONS = [
    "pdf", "doc", "docx", "txt", "rtf"
    
    "xls", "xlsx", "csv"
    
    "ppt", "pptx"

    "jpg", "jpeg", "png", "gif", "bmp", "svg",
    
    "zip", "rar", "7z",
    
    "json", "xml", "yaml", "yml"
]

MAX_FILE_SIZE = 10 * 1024 * 1024

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

def load_dev_users():
    
    users = []
    if not DEV_USERS_FILE.exists():
        return users
    
    try:
        with open(DEV_USERS_FILE, "r", encoding="utf-8") as f :
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                
                parts = line.split(":")
                if len(parts) == 3:
                    email, password, user_id = parts
                    users.append({
                        "email": email.strip(),
                        "password": password.strip(),
                        "user_id": int(user_id.strip())
                    })
                    
    except Exception as e:
        print(f"Warning: Failed to load dev users: {e}")
    return users