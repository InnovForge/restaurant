# React + MySql + Express + Docker

> [!NOTE]
> Hãy sao chép file .env.development và đặt tên file là .env nếu muốn chạy lệnh không thiết lập sẵn 

## dependencies
- [Nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Pnpm](https://pnpm.io/) (optional)

## 🚀 Getting Started with Dev
1. **Run docker compose up** (root project)
```sh
pnpm docker:up # or npm run docker:up
```
2. **Install dependencies**
```sh
pnpm install # or npm install
```
3. **Start the development server**
```sh
pnpm dev # or npm run dev
```
4. **Open the source code and start editing!**
- Client: Your site is now running at `http://localhost:5173`
- Server: Your server is now running at `http://localhost:3001`

## Commands (root project)
```sh
pnpm dev # or npm run dev # start dev server
pnpm docker:up # or npm run docker:up # start docker
pnpm docker:down # or npm run docker:down # stop docker
pnpm docker:clean # or npm run docker:clean # remove docker container and image
```
