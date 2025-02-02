FROM node:23-alpine

WORKDIR /app

ARG VITE_APP_API_URL=http://backend:3000

ENV VITE_APP_API_URL=$VITE_APP_API_URL

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173"]
