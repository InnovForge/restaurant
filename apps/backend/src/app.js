import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenvFlow from "dotenv-flow";
import { logger } from "./utils/logger.js";
import cookieParser from "cookie-parser";

dotenvFlow.config();
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5174",
};
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", router);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  logger.info(`Express server running on port http://localhost:${PORT}/`);
});
