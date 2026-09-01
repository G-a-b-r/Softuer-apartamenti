import os

from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB = 'sqlite:///' + os.path.join(BASE_DIR, 'apartments.db')

DATABASE_URL = os.getenv('DATABASE_URL') or DEFAULT_DB