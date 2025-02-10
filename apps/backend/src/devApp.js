import nodemon from "nodemon";
import ngrok from "@ngrok/ngrok";
import { logger } from "./utils/logger.js";
import localtunnel from "localtunnel";

const PORT = process.env.PORT || 3000;

nodemon({
  script: "src/app.js",
  ext: "js json",
});

let url = null;

nodemon
  .on("start", async () => {
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
