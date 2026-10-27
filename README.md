# Sữa Chi Mai

Website bán sữa: React (Vite) + Express + MySQL.

## Yêu cầu

Docker + Docker Compose v2.

## Chạy app

```bash
docker compose up --build -d
```

Lần đầu: build image → MySQL lên → `db-init` **import** `database/milk_store.sql` + `seed_data.sql`.  
Lần sau: data còn trong volume → `db-init` **skip** import.

| | URL |
|--|--|
| Cửa hàng | ${FRONTEND_URL:-http://localhost:3000} |
| Admin | ${FRONTEND_URL:-http://localhost:3000}/admin |
| API | http://localhost:${EXPOSE_BACKEND_PORT:-5000} |
| Dify | http://localhost:${EXPOSE_NGINX_PORT:-3080} (HTTP), http://localhost:${EXPOSE_NGINX_SSL_PORT:-443} (HTTPS) |

**Admin mẫu:** `admin@gmail.com` / `123456`

## Lệnh hay dùng

```bash
docker compose logs -f          # xem log
docker compose down             # dừng, giữ DB
docker compose down -v          # dừng + xóa DB (lần up sau import lại)
```

### Chạy dịch vụ Updater

Để chạy dịch vụ `updater` riêng biệt (ví dụ, để cập nhật dữ liệu hoặc thực hiện các tác vụ định kỳ), hãy sử dụng lệnh sau:

```bash
docker compose --profile tools up --build -d updater
```

## Cấu trúc

```text
frontend/   React + Nginx (Docker)
backend/    Express API
database/   SQL + docker-init.sh
dify/       Dify 1.18, cùng `docker compose up`
docs/       analysis, architecture, data
```

## Lưu ý

- MySQL trong Compose: `root` / `root`, cổng `3306`. Nếu máy đã có MySQL/`suachimai-mysql` chiếm cổng hoặc tên container → `docker stop suachimai-mysql && docker rm suachimai-mysql` rồi `up` lại.
- Chi tiết setup: [SETUP.md](./SETUP.md)
