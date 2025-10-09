# ----- Stage 1: Frontend bauen -----
FROM node:20-alpine AS web
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# ---------- Stage 2: Backend + Static ----------
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app

# system deps (für mögliche wheels/builds)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl gcc \
    && rm -rf /var/lib/apt/lists/*

# requirements installieren (mit modernem pip)
COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip --version \
 && pip install -r requirements.txt


# App Code + Frontend Build
COPY backend ./
COPY --from=web /app/frontend/dist ./static

ENV PORT=8080 FLASK_ENV=production
EXPOSE 8080
CMD ["gunicorn", "-w", "3", "-b", "0.0.0.0:8080", "app:create_app()"]

