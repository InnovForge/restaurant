import nodemon from "nodemon";
import ngrok from "@ngrok/ngrok";
import { logger } from "./utils/logger.js";
import localtunnel from "localtunnel";
import { ensureBucketExists } from "./configs/minio.js";

const PORT = process.env.PORT || 3000;

nodemon({
  script: "src/app.js",
  ext: "js json",
});

let url = null;

async function waitForMinIO(retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await fetch("http://localhost:9003/minio/health/live");
      // logger.info("✅ MinIO is ready.");
      return;
    } catch (error) {
      // logger.info(`⏳ Waiting for MinIO... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("❌ MinIO failed to start within the expected time.");
}

nodemon
  .on("start", async () => {
    (async () => {
      await waitForMinIO();
      await ensureBucketExists("users");
      await ensureBucketExists("foods");
      await ensureBucketExists("restaurants");
    })();

    if (!url) {
      if (!process.env.NGROK_AUTH_TOKEN) {
        url = await localtunnel({ port: PORT });
        process.env.NGROK_URL = url.url;
      } else {
        url = await ngrok.forward({
          addr: PORT,
          authtoken: process.env.NGROK_AUTH_TOKEN,
        });
        // console.log(url.url());
        process.env.NGROK_URL = url.url();
      }
      logger.info(`App available at ${process.env.NGROK_URL} -> http://localhost:${PORT}`);
    }
  })
  .on("quit", async () => {
    await ngrok.disconnect();
  });

// devApp.js
