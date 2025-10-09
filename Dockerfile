# ---------- Stage 1: Frontend bauen ----------
FROM node:20-alpine AS web
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# (optional) ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---------- Stage 2: Backend + Static ----------
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH=/app \
    PORT=8080

WORKDIR /app

# nur was nötig ist (psycopg wheels -> gcc reicht)
RUN apt-get update && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# Dependencies
COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt

# App-Code
COPY backend/ /app/backend

# gebaute Frontend-Dateien als Flask-Static bereitstellen
COPY --from=web /app/frontend/dist /app/backend/static

EXPOSE 8080

# Robuster Default-Start (App Runner darf das überschreiben)
# Shell-Form, damit ${PORT} / ${WEB_CONCURRENCY} expandieren
CMD gunicorn backend.app:create_app --factory -b 0.0.0.0:${PORT:-8080} -w ${WEB_CONCURRENCY:-3} --timeout 60
