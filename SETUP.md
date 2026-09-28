# Hướng dẫn Setup Sữa Chi Mai

## Yêu cầu
- Node.js >= 18
- MySQL Server >= 5.7
- npm hoặc yarn

## Bước 1: Setup Database MySQL

### 1.1. Khởi chạy MySQL
- Mở MySQL Command Line Client hoặc sử dụng MySQL Workbench
- Hoặc dùng lệnh: `mysql -h localhost -u root -p`

### 1.2. Tạo Database & Import Data
Chạy các lệnh sau:

```sql
-- Tạo database
CREATE DATABASE IF NOT EXISTS milk_store;

-- Sử dụng database
USE milk_store;

-- Import schema (nếu chưa có tables)
-- Chạy file: database/milk_store.sql
SOURCE database/milk_store.sql;

-- Import dữ liệu mẫu (nếu cần)
-- Chạy file: database/seed_data.sql
SOURCE database/seed_data.sql;
```

Hoặc dùng lệnh command line:
```bash
mysql -h localhost -u root < database/milk_store.sql
mysql -h localhost -u root milk_store < database/seed_data.sql
```

### 1.3. Xác nhận
```sql
USE milk_store;
SELECT COUNT(*) as product_count FROM products;
SELECT * FROM products LIMIT 1;
```

## Bước 2: Cấu hình Backend

Kiểm tra file `backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=milk_store
DB_PORT=3306
JWT_SECRET=milk_store_secret_key
CLIENT_URL=http://localhost:3000
CLIENT_URLS=http://localhost:3000,http://localhost:3001
```

Nếu mật khẩu MySQL khác, cập nhật `DB_PASSWORD`.

## Bước 3: Khởi Chạy

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```
Expected: `Milk Store API: http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
Expected: `VITE v8.0.16 ready in X ms ... Local: http://localhost:3000/`

## Bước 4: Truy Cập
Mở browser: **http://localhost:3000**

## Troubleshooting

### Frontend hiển thị "0 sản phẩm"
- Kiểm tra Backend terminal có error không
- Kiểm tra MySQL có chạy: `mysql -h localhost -u root -e "SELECT 1"`
- Kiểm tra database có data: `mysql -h localhost -u root milk_store -e "SELECT COUNT(*) FROM products"`

### Backend crash "Error: listen EADDRINUSE"
- Port 5000 đã được dùng. Kill process hoặc thay port trong `.env`

### CORS error
- Xác nhận `CLIENT_URL` trong `backend/.env` khớp với frontend URL

### Database connection error
- Xác nhận MySQL running trên port 3306
- Xác nhận DB credentials trong `backend/.env` đúng
- Xác nhận database `milk_store` tồn tại

## Admin Panel

Sau khi setup xong, login admin:
- URL: http://localhost:3000/admin
- Tài khoản mẫu: (kiểm tra `seed_data.sql` để biết thông tin)

---

**Status:** 
- ✅ Frontend chạy tại http://localhost:3000
- ✅ Backend chạy tại http://localhost:5000
- ⏳ Database cần khởi tạo SQL files
