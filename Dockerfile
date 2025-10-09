# ----- Stage 1: Frontend bauen -----
FROM node:20-alpine AS web
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# ----- Stage 2: Backend + Static ausliefern -----
FROM python:3.11-slim AS api
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System deps (psycopg optional)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && rm -rf /var/lib/apt/lists/*

# Python deps
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir gunicorn

# App Code
COPY backend ./
# Frontend Build als Static ins Backend packen
COPY --from=web /app/frontend/dist ./static

# Prod Env
ENV PORT=8080 \
    FLASK_ENV=production

EXPOSE 8080
# Gunicorn startet die App Factory
CMD ["gunicorn", "-w", "3", "-b", "0.0.0.0:8080", "app:create_app()"]
