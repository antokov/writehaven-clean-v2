# ----- Stage 1: Frontend bauen -----
FROM node:20-alpine AS web
WORKDIR /app/frontend
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build  # erzeugt frontend/dist

# ---------- Stage 2: Backend + Static ----------
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app

# System-Deps (f�r Wheels/psycopg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc \
 && rm -rf /var/lib/apt/lists/*

# Requirements installieren
COPY backend/requirements.txt ./backend/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install -r backend/requirements.txt

# App-Code + Static aus Stage 1
COPY backend ./backend
# WICHTIG: nach backend/static kopieren (Flask static_folder="static" relativ zum Paket)
COPY --from=web /app/frontend/dist ./backend/static

ENV PORT=8080
EXPOSE 8080

# Robust & simpel: starte das exportierte WSGI-Objekt aus backend/wsgi.py
CMD ["gunicorn", "-k", "gthread", "-w", "2", "-b", "0.0.0.0:8080", "backend.wsgi:app"]
