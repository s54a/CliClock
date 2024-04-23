import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import fixWindowsPath from "./fixWindowsPath.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to save config to file
function saveConfig() {
  const configFilePath = path.resolve(__dirname, "config.js");

  // Ensure vlcExePath and audioPath are defined before fixing their paths
  const fixedVLCExePath = config.vlcExePath
    ? fixWindowsPath(config.vlcExePath)
    : "";
  const fixedAudioPath = config.audioPath
    ? fixWindowsPath(config.audioPath)
    : "";

  fs.writeFileSync(
    configFilePath,
    `const config = {
      vlcExePath: "${fixedVLCExePath}",
      audioPath: "${fixedAudioPath}",
};

export default config;\n`
  );
}

export default saveConfig;
