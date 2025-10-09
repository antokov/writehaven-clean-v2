# backend/wsgi.py
try:
    from backend.app import create_app   # Paket-Start
except ImportError:
    from app import create_app           # Container-Start (WORKDIR=/app)

app = create_app()
