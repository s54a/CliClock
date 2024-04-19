import readline from "readline";
import { stopSound } from "./soundFunctions.js";
import runCommand from "./runCommand.js";
import config from "./config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handleSnoozeInput = (answer) => {
  const snoozeMatch = answer.match(/^(\d+)([smh])$/i);

  if (snoozeMatch) {
    const snoozeTime = parseInt(snoozeMatch[1]);
    const snoozeUnit = snoozeMatch[2].toLowerCase();

    let snoozeMilliseconds = 0;

    switch (snoozeUnit) {
      case "s":
        snoozeMilliseconds = snoozeTime * 1000;
        break;
      case "m":
        snoozeMilliseconds = snoozeTime * 60 * 1000;
        break;
      case "h":
        snoozeMilliseconds = snoozeTime * 60 * 60 * 1000;
        break;
    }

    if (config.vlcExePath !== "no") {
      stopSound();
    }

    console.log(`Snoozing for ${snoozeTime}${snoozeUnit}`);

    const command = `t ${snoozeTime}${snoozeUnit}`;

    runCommand(command);

    rl.close();
  } else {
    console.log("Invalid snooze duration format. Snooze not applied.");
    rl.close();
  }
};

export default handleSnoozeInput;
