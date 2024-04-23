import chalk from "chalk";
import { stopSound } from "./soundFunctions.js";
import runCommand from "./runCommand.js";
import config from "./config.js";
import rl from "./cliInterface.js";
import parseTimeInput from "./parseTimeInput.js";

const handleSnoozeInput = (answer) => {
  const snoozeTimeInput = answer.trim(); // Trim any leading/trailing whitespace
  const { totalSeconds, formattedTime, input } =
    parseTimeInput(snoozeTimeInput);

  if (totalSeconds > 0) {
    if (config.vlcExePath !== "no") {
      stopSound();
    }

    console.log(chalk.green(`Snoozing for ${formattedTime}`));

    const command = `t ${input}`;

    runCommand(command);

    rl.close();
  } else {
    console.log(
      chalk.red("Invalid snooze duration format. Snooze not applied.")
    );
    rl.close();
  }
};

export default handleSnoozeInput;
