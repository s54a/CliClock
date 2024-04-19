import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to save config to file
function saveConfig() {
  const configFilePath = path.resolve(__dirname, "config.js");
  const { vlcExePath, audioPath } = config;

  fs.writeFileSync(
    configFilePath,
    `const config = {
      vlcExePath:"${vlcExePath}",
      audioPath: "${audioPath}",
};

export default config;\n`
  );
}

export default saveConfig;
