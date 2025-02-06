import nodemon from "nodemon";
import ngrok from "@ngrok/ngrok";
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
      url = await ngrok.forward({
        addr: PORT,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });
      // console.log(url.url());
      process.env.NGROK_URL = url.url();
      logger.info(`Ngrok now available at ${process.env.NGROK_URL} -> http://localhost:${PORT}`);
    }
  })
  .on("quit", async () => {
    await ngrok.disconnect();
  });

// devApp.js
