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
| Cửa hàng | http://localhost:${EXPOSE_FRONTEND_PORT:-3000} |
| Admin | http://localhost:${EXPOSE_FRONTEND_PORT:-3000}/admin |
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

## Cấu hình Domain với Cloudflare Tunnel

Để expose các dịch vụ của bạn ra internet với các domain tùy chỉnh thông qua Cloudflare Tunnel, bạn sẽ chạy `cloudflared` trong một container Docker Compose.

**Các bước chuẩn bị:**

1.  **Cài đặt `cloudflared` (nếu chưa có)**: Bạn sẽ cần `cloudflared` trên máy cục bộ để đăng nhập và tạo tunnel. Làm theo hướng dẫn tại [developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).
2.  **Đăng nhập vào Cloudflare**: Chạy `cloudflared tunnel login` trên máy cục bộ và làm theo hướng dẫn để xác thực tài khoản Cloudflare của bạn.
3.  **Tạo một Tunnel**: Chạy `cloudflared tunnel create suachimai` trên máy cục bộ. Ghi `Tunnel ID` vào `tunnel:` trong `cloudflared/config.yml`. Hostname cũng ghi thẳng trong file đó. `cloudflared` không đọc các biến này từ `.env`.
4.  **Đặt tệp thông tin xác thực**: Copy file `<TUNNEL_ID>.json` thành `credentials.json` ở thư mục gốc repo. Compose mount file này vào `/etc/cloudflared/credentials.json`.

**Cấu hình file `cloudflared/config.yml`:**

File `cloudflared/config.yml` đã được cung cấp trong repo của bạn. Hãy đảm bảo rằng nó có nội dung sau:

```yaml
tunnel: 50d7e184-56fc-4813-9569-a4153b9a5a23
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - hostname: suachimai.store
    service: http://frontend:80
  - hostname: api.suachimai.store
    service: http://backend:5000
  - hostname: dify.suachimai.store
    service: http://nginx:80
  - service: http_status:404
```

**Tạo bản ghi DNS cho Tunnel:**

Để lưu lượng truy cập từ internet tìm thấy Cloudflare Tunnel của bạn, bạn cần tạo các bản ghi DNS trong Cloudflare của bạn. Bạn có thể làm điều này bằng hai cách:

*   **Sử dụng `cloudflared` CLI (khuyên dùng)**: Sau khi tạo tunnel, chạy các lệnh sau cho mỗi domain:
    ```bash
    cloudflared tunnel route dns suachimai suachimai.store
    cloudflared tunnel route dns suachimai api.suachimai.store
    cloudflared tunnel route dns suachimai dify.suachimai.store
    ```
*   **Thủ công qua Cloudflare Dashboard**: Đăng nhập vào Cloudflare Dashboard, chọn domain, rồi vào DNS. Tạo bản ghi `CNAME` cho `suachimai.store`, `api.suachimai.store` và `dify.suachimai.store`, trỏ tới `<TUNNEL_ID>.cfargotunnel.com`.

**Chạy Cloudflare Tunnel Container:**

Sau khi đã chuẩn bị xong, bạn có thể chạy container `cloudflared` bằng lệnh:

```bash
docker compose --profile tools up -d cloudflared
```

Điều này sẽ khởi động dịch vụ `cloudflared` trong một container riêng biệt, sử dụng cấu hình và thông tin xác thực bạn đã cung cấp để thiết lập tunnel đến các dịch vụ của bạn.

## Cấu trúc

```text
frontend/   React + Nginx (Docker)
backend/    Express API
database/   SQL + docker-init.sh
dify/       Dify 1.18, cùng `docker compose up`
docs/       analysis, architecture, data
cloudflared/ Cấu hình và credentials cho Cloudflare Tunnel
```

## Lưu ý

- MySQL trong Compose: `root` / `root`, cổng `3306`. Nếu máy đã có MySQL/`suachimai-mysql` chiếm cổng hoặc tên container → `docker stop suachimai-mysql && docker rm suachimai-mysql` rồi `up` lại.
- Chi tiết setup: [SETUP.md](./SETUP.md)
