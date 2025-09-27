import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenvFlow from "dotenv-flow";
import cookieParser from "cookie-parser";
import { camelCase } from "./middlewares/camelCase.js";
import { createServer } from "http";
import { initSocket } from "./sockets/socket.js";
import rateLimit from "express-rate-limit";
import { redisApiCache } from "./configs/redis.js";
import RedisStore from "rate-limit-redis";
import logger from "./configs/logger.js";

dotenvFlow.config();
const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  }),
);

const LOG_COOLDOWN = 10 * 60; // 10 phút

async function safeLogRateLimit(ip, msg) {
  const key = `ratelimit:log:${ip}`;
  const exists = await redisApiCache.exists(key);
  if (!exists) {
    logger.warn(msg);
    await redisApiCache.set(key, "1", "EX", LOG_COOLDOWN);
  }
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 100, // mỗi IP max 100 request
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  store: new RedisStore({
    sendCommand: (...args) => redisApiCache.call(...args),
  }),
  handler: async (req, res) => {
    await safeLogRateLimit(req.ip, `Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ message: "Too many requests" });
  },
});

app.use(limiter);

app.use("/api", camelCase());
app.use("/api", router);

app.get("/", async (req, res) => {
  res.send("Hello World! this is backend server cdio@team1");
});

initSocket(server);

server.listen(PORT, () => {
  logger.info(`Express server running on port http://localhost:${PORT}/`);
});
