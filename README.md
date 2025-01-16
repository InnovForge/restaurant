# React + MySql + Express + Docker

> [!NOTE]
> Hãy sao chép file .env.development và đặt tên file là .env nếu muốn chạy lệnh ***docker compose*** không thiết lập sẵn 

## Dependencies
- [Nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Pnpm](https://pnpm.io/)

## **Setup environment**(required pnpm)
```sh
pnpm run setup
```
## 🚀 Getting Started with Dev
1. **Run docker**  (root project)
```sh
pnpm docker:start # or npm run docker:start
```
2. **Start the development server**
```sh
pnpm dev # or npm run dev
```
4. **Open the source code and start editing!**
- Client: Your site is now running at `http://localhost:5174`
- Server: Your server is now running at `http://localhost:3001`

## Commands (root project)
```sh
pnpm dev # or npm run dev # start dev server
pnpm docker:build # or npm run docker:build # build docker image
pnpm docker:start # or npm run docker:start # start docker container
pnpm docker:restart # or npm run docker:restart # restart docker
pnpm docker:stop # or npm run docker:stop # stop docker container
pnpm docker:up # or npm run docker:up # build and start docker container  
pnpm docker:down # or npm run docker:down # stop docker and remove container
pnpm docker:clean # or npm run docker:clean # remove docker container and image
```
