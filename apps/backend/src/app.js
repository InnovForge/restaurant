import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenvFlow from "dotenv-flow";
import { logger } from "./utils/logger.js";
import cookieParser from "cookie-parser";
import swaggerDocs from "./swagger.js";
import { camelCase } from "./middlewares/camelCase.js";
import { createServer } from "http";
import { initSocket } from "./sockets/socket.js";

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
app.use("/api", camelCase());
app.use("/api", router);

app.get("/", async (req, res) => {
  res.send("Hello World! this is backend server cdio@team1");
});

initSocket(server);

server.listen(PORT, () => {
  logger.info(`Express server running on port http://localhost:${PORT}/`);
  swaggerDocs(app, PORT);
});
