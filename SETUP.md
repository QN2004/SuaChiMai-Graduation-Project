# Setup (Docker)

## Chạy

```bash
docker compose up --build -d
```

| Service | Việc làm |
|---------|----------|
| `mysql` | MySQL 8, volume `mysql_data` |
| `db-init` | Có bảng `products` → **skip**; chưa có → import schema + seed |
| `backend` | API `:5000` (sau khi db-init xong) |
| `frontend` | UI `:3000` |

## Kiểm tra import

```bash
docker compose logs db-init
```

Thấy `Import completed` (lần đầu) hoặc `already imported — skip` (lần sau).

## Truy cập

- http://localhost:3000 — cửa hàng  
- http://localhost:3000/admin — `admin@gmail.com` / `123456`  
- http://localhost:5000 — API  
- http://localhost:5000/api/docs — Swagger UI 

## Reset DB

```bash
docker compose down -v
docker compose up --build -d
```

## Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|------------|------------|
| Tên/`3306` conflict | `docker rm -f suachimai-mysql` rồi `up` lại |
| Không có data | `docker compose down -v && docker compose up --build -d` |
| API không lên | `docker compose logs backend` |
