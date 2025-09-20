import Redis from "ioredis";

const redisApiCache = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  db: 0,
});

export { redisApiCache };
