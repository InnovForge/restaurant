FROM node:23-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY .env.development /app/.env

RUN npm install --production

COPY  src /app/src

EXPOSE 3001

CMD ["npm", "start"]
