import os

from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB = 'sqlite:///' + os.path.join(BASE_DIR, 'apartments.db')

def _normalize_db_url(url):
    if not url:
        return url
    if url.startswith('postgres://'):
        return 'postgresql://' + url[len('postgres://'):]
    return url

DATABASE_URL = _normalize_db_url(os.getenv('DATABASE_URL') or DEFAULT_DB)