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
| `frontend` | UI `:3001` |
| `nginx` và các service Dify | Console Dify `:3080` |

## Kiểm tra import

```bash
docker compose logs db-init
```

Thấy `Import completed` (lần đầu) hoặc `already imported — skip` (lần sau).

## Truy cập

- http://localhost:3001 — cửa hàng
- http://localhost:3001/admin — `admin@gmail.com` / `123456`
- http://localhost:5000 — API
- http://localhost:5000/api/docs — Swagger UI
- http://localhost:3080 — Dify. Chatbot chỉ trả lời sau mục dưới.

## Dify

Làm sau khi `docker compose up --build -d` đã chạy xong. Backend gọi Dify tại `http://nginx/v1`.

1. Mở http://localhost:3080, tạo tài khoản admin. Vào **Settings → Model Provider**, cài **OpenRouter** và dán API key. Flow dùng `google/gemini-2.5-flash`, `deepseek/deepseek-v4-flash` và embedding `openai/text-embedding-3-large`.
2. **Studio → Import DSL**, chọn `docs/ai/AI Assistant.ifpkg`.
3. Tạo sáu knowledge base, embedding `openai/text-embedding-3-large`, rồi upload đúng file:

   | Knowledge base | File |
   |---|---|
   | General FAQ | `docs/ai/General-FAQ.pdf` |
   | Age & Nutrition | `docs/ai/Age-Nutrition.pdf` |
   | Usage & Preparation | `docs/ai/Usage-Preparation.pdf` |
   | Allergy & Ingredients | `docs/ai/Allergy-Ingredients.pdf` |
   | Delivery & Orders | `docs/ai/Delivery-Orders.pdf` |
   | Returns & Support | `docs/ai/Returns-Support.pdf` |

4. Mở chatflow vừa import. Gắn mỗi node **Knowledge Retrieval** vào knowledge base cùng tên. Đổi URL hai node HTTP thành `http://backend:5000/api/products` và `http://backend:5000/api/orders/my-orders`. Dify mặc định chặn IP nội bộ. File compose đã cho phép `172.16.0.0/12`, `10.0.0.0/8` và `192.168.0.0/16` để gọi `backend`. **Publish** app.
5. Trong app, **API Access** → tạo key `app-...`. Ghi vào `DIFY_API_KEY` của backend trong `docker-compose.yml`.
6. Chạy lại backend:

```bash
docker compose up -d backend
```

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
