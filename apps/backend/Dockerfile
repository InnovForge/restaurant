FROM node:23-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY package.json package-lock.json* ./
COPY .env.development /app/.env

RUN npm install --production

COPY  src /app/src

EXPOSE 3000

CMD ["npm", "start"]
