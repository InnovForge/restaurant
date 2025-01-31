import nodemon from "nodemon";
import ngrok from "ngrok";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

nodemon({
  script: "src/app.js",
  ext: "js json",
});

let url = null;

nodemon
  .on("start", async () => {
    if (!url) {
      url = await ngrok.connect({ port: PORT });
      process.env.NGROK_URL = url;
      logger.info(`Ngrok now available at ${url} -> http://localhost:${PORT}`);
    }
  })
  .on("quit", async () => {
    await ngrok.kill();
  });

// devApp.js
