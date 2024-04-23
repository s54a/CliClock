#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk"; // Import chalk
import config from "./config.js";
import getVLCPath from "./getVLCPath.js";
import saveConfig from "./saveConfig.js";
import parseTimeInput from "./parseTimeInput.js";
import { playSound } from "./soundFunctions.js";
import handleSnoozeInput from "./handleSnoozeInput.js";
import notifyTimer from "./notifyTimer.js";
import setDefaultAudioPath from "./setDefaultAudioPath.js";
import exitCliClock from "./exitCliClock.js";
import rl from "./cliInterface.js";

// Get current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Command line arguments
const [, , arg, value] = process.argv;

let interval;

// Extracting time from arg. If the first things is a number then it strips any alphabets and returns the numbers
const time = parseInt(arg);

if (time <= 0) {
  console.error(chalk.red("Time must be a Positive Value."));
  process.exit(1);
}

if (!arg) {
  const displayTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    console.clear(); // Clear console to update time
    console.log(
      chalk.green(
        `Current time is: ${hours}:${minutes}:${seconds}:${milliseconds}`
      )
    );
  };
  // Calling displayTime() initially and then updating every millisecond
  setInterval(displayTime, 1);
  exitCliClock(interval);
} else if (arg === "-s") {
  if (value) {
    console.error(
      chalk.red("You don't have to pass a value when you use Stopwatch")
    );
    process.exit();
  }

  // Stopwatch functionality
  let startTime = Date.now();

  const displayStopwatch = () => {
    const elapsedTime = Date.now() - startTime;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const milliseconds = elapsedTime % 1000;
    console.clear();
    console.log(
      chalk.blue(
        `Elapsed time: ${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`
      )
    );
  };

  // Start displaying stopwatch every second
  interval = setInterval(displayStopwatch, 1);

  exitCliClock(interval);
} else if (arg === "-h") {
  if (value) {
    console.error(
      chalk.red("You don't have to pass a value when you want to see Help")
    );
    process.exit();
  }

  console.log(
    chalk.yellow(`
${chalk.bold("CliClock Help Menu:")}
${chalk.green(
  "------------------------------------------------------------------"
)}
${chalk.cyan("- To display current time:")}
  ${chalk.blue("t")}

${chalk.cyan("- To start a stopwatch:")}
  ${chalk.blue("t -s")}

${chalk.cyan("- To set a timer:")}
  ${chalk.blue("t [time]")}
  ${chalk.gray("Example:")} ${chalk.blue("t 10m")}
  (${chalk.green("Supported units:")} ${chalk.yellow(
      "h = hours, m = minutes, s = seconds"
    )})

${chalk.cyan("- To set a timer with a funny sound:")}
  ${chalk.blue("t [time] -f")}

${chalk.cyan("- To set the path to the VLC executable:")}
  ${chalk.blue("t --vlc-path [path]")}

${chalk.cyan("- To set the path to the audio file for the alarm:")}
  ${chalk.blue("t --audio-path [path]")}
  (${chalk.gray("Use")} ${chalk.yellow("'default-audio'")} ${chalk.gray(
      "to set the default audio file"
    )})
  ${chalk.blue('t --audio-path "default-audio"')}

${chalk.green(
  "------------------------------------------------------------------"
)}
${chalk.blue("Made by Sooraj Gupta for Lazy People")}
${chalk.blue("GitHub:")} ${chalk.underline("https://github.com/s54a")}
${chalk.blue("NPM Package Repo:")} ${chalk.underline(
      "https://github.com/s54a/s54a-cliclock"
    )}
${chalk.blue("NPM Package:")} ${chalk.underline(
      "https://www.npmjs.com/package/@s54a/cliclock"
    )}
`)
  );

  process.exit();
} else if (time) {
  if (value === "-f") {
    const funnySound = path.join(__dirname, "../sound.mp3");
    config.audioPath = funnySound;
  } else if (value) {
    console.error(chalk.red(`Wrong Argument "${value}"`));
    process.exit(1);
  }

  const vlcPath = await getVLCPath();
  setDefaultAudioPath();

  const { totalSeconds, formattedTime } = parseTimeInput(arg);

  const startTimer = () => {
    const endTime = Date.now() + totalSeconds * 1000;

    const displayCountdown = () => {
      clearInterval(interval);
      const remainingTime = endTime - Date.now();
      const secondsRemaining = Math.ceil(remainingTime / 1000);

      const secondsString = secondsRemaining === 1 ? "Second" : "Seconds";

      console.clear();
      console.log(`
Timer set for ${chalk.green(formattedTime)}
Time remaining:  ${chalk.green(secondsRemaining)} ${chalk.green(secondsString)}
      `);

      if (secondsRemaining > 0) {
        interval = setInterval(displayCountdown, 500);
      } else if (secondsRemaining <= 0) {
        clearInterval(interval);
        console.clear();
        console.log(`
Timer set for ${chalk.green(formattedTime)} 
Time remaining: ${chalk.green("0")} seconds
      `);
        console.log(chalk.green("Timer ended!"));

        notifyTimer(formattedTime, interval);

        if (config.vlcExePath && config.vlcExePath.toLowerCase() !== "no") {
          playSound();
        }

        rl.question("Snooze Timer for: ", handleSnoozeInput);
      }
    };
    displayCountdown();
    exitCliClock(interval);
  };

  if (vlcPath) {
    startTimer();
  } else {
    console.log(chalk.red("\nVLC path not found. Exiting..."));
    process.exit(1);
  }
} else if (arg === "--vlc-path") {
  if (value.toLowerCase() === "no") {
    config.vlcExePath = value;
    saveConfig();
    console.log(chalk.green("Sound won't Play"));
    process.exit();
  } else if (!fs.existsSync(value)) {
    console.error(chalk.red("\nInvalid VLC executable path. Try Again"));
    process.exit(1);
  }

  config.vlcExePath = value;
  saveConfig();

  console.log(chalk.green("\nNew VLC path set:"), chalk.green(`"${value}"`));
  process.exit();
} else if (arg === "--audio-path") {
  if (value === "default-audio") {
    const audioPath = path.join(__dirname, "../audio.mp3");
    config.audioPath = audioPath;
    saveConfig();
    console.log(chalk.green("\nDefault Audio Path Set"));
  } else {
    if (!fs.existsSync(value)) {
      console.error(chalk.red("\nInvalid audio file path. Try Again"));
      process.exit(1);
    }
    config.audioPath = value;
    saveConfig();
    console.log(
      chalk.green("\nNew audio Path Set:"),
      chalk.green(`"${value}"`)
    );
  }

  process.exit();
} else {
  const [, , ...arg] = process.argv;
  console.error(chalk.red(`\nInvalid option: ${arg}`));
  process.exit();
}
