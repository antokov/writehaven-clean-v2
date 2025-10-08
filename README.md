# Writehaven – Clean Rebuild v2 (voll funktionsfähig)

## Lokal starten
### Backend
```bash
cd backend
python -m venv .venv
# PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Variante 1 (Repo-Root):
python -m backend.app
# Variante 2 (Direkt im Ordner backend):
# python app.py
```
Test:
- http://127.0.0.1:5000/api/health → {"status":"ok"}
- POST http://127.0.0.1:5000/api/projects  Body: {"title":"Test"}

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://127.0.0.1:5173
```

## Cloud
- Amplify (Frontend): VITE_API_BASE_URL = AppRunner-URL
- App Runner (Backend): ENV DATABASE_URL=postgresql+psycopg://USER:PASS@HOST:5432/DB
