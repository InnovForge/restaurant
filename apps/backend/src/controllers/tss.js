import responseHandler from "../utils/response.js";
import { validateFields } from "../utils/validate-fields.js";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const API_KEY = process.env.FPT_API_KEY;
const API_URL = "https://api.fpt.ai/hmi/tts/v5";

export const textToSpeech = async (req, res) => {
  try {
    const { text } = req.body;
    const err = validateFields(req.body, ["text"], true);
    if (err) {
      return responseHandler.badRequest(res, undefined, err);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "api-key": API_KEY,
        speed: "",
        voice: "minhquang",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    console.log("data", data);

    if (!data.async) throw new Error("Failed to get audio URL");

    let audioUrl = data.async;

    let retries = 10;
    while (retries > 0) {
      const audioResponse = await fetch(audioUrl);

      if (audioResponse.ok) {
        res.setHeader("Content-Type", "audio/mpeg");
        await streamPipeline(audioResponse.body, res);
        return;
      }

      retries--;
      console.log(`Audio not ready yet. Retrying... (${5 - retries} retries left)`);
      await sleep(2000);
    }

    throw new Error("Cannot fetch audio file after multiple attempts.");
  } catch (error) {
    console.log("error :>> ", error);
    responseHandler.internalServerError(res, error.message);
  }
};
