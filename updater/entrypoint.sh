#!/usr/bin/env bash
# Bấm Start (▶) trên Docker Desktop → pull git + build/up lại app.
# Build dùng /workspace (path trong container).
# Up --no-build dùng HOST_PROJECT_DIR (path trên Windows host) để volume bind đúng.
set -euo pipefail

HOST_DIR="${HOST_PROJECT_DIR:-D:/DO-AN/SuaChiMai-Graduation-Project}"

echo "==> Host project: $HOST_DIR"
cd /workspace

if [[ ! -f /workspace/docker-compose.yml ]]; then
  echo "Không thấy docker-compose.yml — kiểm tra mount path Windows." >&2
  exit 1
fi

git config --global --add safe.directory /workspace || true

if [[ -d /workspace/.git ]]; then
  CURRENT="$(git rev-parse --abbrev-ref HEAD)"
  echo "==> git pull ($CURRENT)"
  git pull --ff-only origin "$CURRENT" || git pull --ff-only
else
  echo "==> Không phải git repo — bỏ qua pull"
fi

echo "==> docker build backend"
docker build -t suachimai-backend:local /workspace/backend

echo "==> docker build frontend"
docker build \
  -t suachimai-frontend:local \
  --build-arg VITE_API_URL=http://localhost:5000 \
  /workspace/frontend

# name: suachimai trong compose.yml + COMPOSE_PROJECT_NAME → không lệch project khi path khác
export COMPOSE_PROJECT_NAME=suachimai
COMPOSE=(docker compose -f /workspace/docker-compose.yml --project-directory "$HOST_DIR")

echo "==> docker compose up -d --no-build (mysql db-init backend frontend)"
"${COMPOSE[@]}" up -d --no-build mysql db-init backend frontend

echo
"${COMPOSE[@]}" ps
echo
echo "Xong. Updater thoát (Exited) — lần sau bấm Start ▶ để cập nhật lại."
echo "  http://localhost:3000"
