import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import saveConfig from "./saveConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function setDefaultAudioPath() {
  if (!config.audioPath || config.audioPath === "undefined") {
    // Set default audio path only if it hasn't been set by the user
    const audioPath = path.join(__dirname, "../audio.mp3");
    config.audioPath = audioPath;
    saveConfig();
  }
}
