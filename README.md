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
| Cửa hàng | http://localhost:3001 |
| Admin | http://localhost:3001/admin |
| API | http://localhost:5000 |
| Dify | http://localhost:3080 |

**Admin mẫu:** `admin@gmail.com` / `123456`

## Lệnh hay dùng

```bash
docker compose logs -f          # xem log
docker compose down             # dừng, giữ DB
docker compose down -v          # dừng + xóa DB (lần up sau import lại)
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
