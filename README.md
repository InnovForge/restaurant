# React + MySql + Express + Docker + Minio

## Dependencies
- [Nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Pnpm](https://pnpm.io/)

## **Setup environment**(required pnpm)
```sh
pnpm run setup
```
## 🚀 Getting Started with Dev (required pnpm)
1. **Start the development server(inlucde docker)**
```sh
pnpm dev
```
2. **Open the source code and start editing!**
- Client: site running at `http://localhost:5174`
- Server: server running at `http://localhost:3001`
- Swagger: api doc running at `http://localhost:3001/docs`
- MySql: database running at `http://localhost:3307` (username: team1, password: cdio@team1)
- Minio(Storage): storage running at `http://localhost:9002`
- Minio(Console): console running at `http://localhost:9003` (username: team1, password: cdio@team1)

## Commands (root project)
```sh
pnpm dev  #  (include docker pnpm docker:start)
pnpm docker:build # or npm run docker:build # build docker image
pnpm docker:start # or npm run docker:start # start docker container
pnpm docker:restart # or npm run docker:restart # restart docker
pnpm docker:stop # or npm run docker:stop # stop docker container
pnpm docker:up # or npm run docker:up # build and start docker container  
pnpm docker:down # or npm run docker:down # stop docker and remove container
pnpm docker:clean # or npm run docker:clean # remove docker container and image
```
