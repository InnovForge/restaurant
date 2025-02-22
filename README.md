# React + MySql + Express + Docker + Minio + Redis

## Yêu cầu
- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Pnpm](https://pnpm.io/)

## Port Usage (mặc định)
- **Client**: `http://localhost:5174`
- **Server**: `http://localhost:3001`
- **Swagger**: `http://localhost:3001/docs` (tài liệu API)
- **MySQL**: `http://localhost:3307` (user: team1, pass: cdio@team1)
- **Minio (Storage)**: `http://localhost:9002` (kho lưu trữ file)
- **Minio (Console)**: `http://localhost:9003` (user: team1, pass: cdio@team1) (giao diện quản lý Minio)
- **Redis**: `http://localhost:6380` (cơ sở dữ liệu cache)

# 🚀 Hướng dẫn sử dụng 

## Cài đặt (lần đầu)
```sh
pnpm run setup
```

## Chạy ứng dụng
 
- **Chạy Docker**:
  ```sh
  pnpm docker:up -d
  ```
- **Chạy toàn bộ ứng dụng** (frontend & backend):
  ```sh
  pnpm dev
  ```
- **Chạy frontend**:
  ```sh
  pnpm dev:fe
  ```
- **Chạy backend**:
  ```sh
  pnpm dev:be
  ```

## Quản lý Docker
- **Xây dựng Docker image**:
  ```sh
  pnpm docker:build
  ```
- **Khởi động container**:
  ```sh
  pnpm docker:start
  ```
- **Khởi động lại container**:
  ```sh
  pnpm docker:restart
  ```
- **Dừng container**:
  ```sh
  pnpm docker:stop
  ```
- **Xây dựng & khởi động container**:
  ```sh
  pnpm docker:up
  ```
- **Dừng & xoá container**:
  ```sh
  pnpm docker:down
  ```
- **Xoá toàn bộ container & volume**:
  ```sh
  pnpm docker:clean
  ```

## Kiểm tra & định dạng mã nguồn
- **Kiểm tra linting**:
  ```sh
  pnpm lint
  ```
- **Sửa lỗi linting tự động**:
  ```sh
  pnpm lint:fix
  ```
- **Định dạng mã nguồn**:
  ```sh
  pnpm format
  ```

## Dọn dẹp dependencies
- **Xoá `node_modules/`(tất cả)**:
  ```sh
  pnpm clean:deps
  ```
- **Xoá & cài lại dependencies**:
  ```sh
  pnpm clean:deps && pnpm install
  ```
- **Dọn dẹp toàn bộ dependencies & Docker**:
  ```sh
  pnpm clean:all
  ```
##  Dữ liệu:

 ## 1. khởi tạo Dữ Liệu

Lệnh này dùng để ghi dữ liệu vào cơ sở dữ liệu, giúp khởi tạo dữ liệu ban đầu hoặc thêm dữ liệu mẫu để kiểm thử.

### Cách sử dụng:
```sh
pnpm seed 
```
- Các tùy chọn:
 - **-y**: Bỏ qua xác nhận
- Nếu không cung cấp mật khẩu, mật khẩu mặc định sẽ là cdio@team1

 ## Xoá dữ liệu database

```sh
pnpm clean:db
```
- Các tùy chọn:
 - **-y**: Bỏ qua xác nhận và xoá dữ liệu ngay lập tức.

