# Wenn als Root: backend.app
# Wenn backend/ als Working Dir: app
try:
    from app import create_app
except ImportError:
    from backend.app import create_app

app = create_app()
