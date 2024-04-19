#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import config from "./config.js";
import getVLCPath from "./getVLCPath.js";
import saveConfig from "./saveConfig.js";
import fixWindowsPath from "./fixWindowsPath.js";
import parseTimeInput from "./parseTimeInput.js";
import { playSound } from "./soundFunctions.js";
import handleSnoozeInput from "./handleSnoozeInput.js";
import notifyTimer from "./notifyTimer.js";
import setDefaultAudioPath from "./setDefaultAudioPath.js";
import exitCliClock from "./exitCliClock.js";

// Get current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Command line arguments
const [, , arg, value] = process.argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let interval;

// Extracting time from arg. If the first things is a number then it strips any alphabets and returns the numbers
const time = parseInt(arg);

if (time <= 0) {
  console.error("Time must be a Positive Value.");
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
      `Current time is: ${hours}:${minutes}:${seconds}:${milliseconds}`
    );
  };
  // Calling displayTime() initially and then updating every millisecond
  setInterval(displayTime, 1);
  exitCliClock(interval);
} else if (arg === "-s") {
  if (value) {
    console.error("You don't have to pass a value when you use Stopwatch");
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
      `Elapsed time: ${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`
    );
  };

  // Start displaying stopwatch every second
  interval = setInterval(displayStopwatch, 1);

  exitCliClock(interval);
} else if (arg === "-h") {
  if (value) {
    console.error("You don't have to pass a value when you want to see Help");
    process.exit();
  }

  console.log("test");

  process.exit();
} else if (time) {
  if (value === "-f") {
    const funnySound = path.join(__dirname, "../sound.mp3");
    config.audioPath = fixWindowsPath(funnySound);
  } else if (value) {
    console.error(`Wrong Argument "${value}"`);
    process.exit(1);
  }

  setDefaultAudioPath();
  const vlcPath = await getVLCPath();

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
Timer set for ${formattedTime}
Time remaining:  ${secondsRemaining} ${secondsString}
      `);

      if (secondsRemaining > 0) {
        interval = setInterval(displayCountdown, 500);
      } else if (secondsRemaining <= 0) {
        clearInterval(interval);
        console.clear();
        console.log(`
Timer set for ${formattedTime} 
Time remaining: 0 seconds
      `);
        console.log("Timer ended!");

        notifyTimer(formattedTime, interval);

        if (config.vlcExePath !== "no") {
          playSound();
        }

        rl.question("Snooze Timer for: ", handleSnoozeInput);
      }
    };
    displayCountdown();
  };

  if (vlcPath) {
    startTimer();
    exitCliClock(interval);
  } else {
    console.log("\nVLC path not found. Exiting...");
    process.exit(1);
  }
} else if (arg === "--vlc-path") {
  if (!fs.existsSync(value)) {
    console.error("\nInvalid VLC executable path. Try Again");
    process.exit(1);
  }

  config.vlcExePath = value;
  saveConfig();

  console.log("\nNew VLC path set:", `"${value}"`);
  process.exit();
} else if (arg === "--audio-path") {
  if (!fs.existsSync(value)) {
    console.error("\nInvalid audio file path. Try Again");
    process.exit(1);
  }

  if (value === "default-path") {
    const audioPath = path.join(__dirname, "../audio.mp3");
    config.audioPath = fixWindowsPath(audioPath);
    saveConfig();
    console.log("\nDefault-Path Set:", `"${value}"`);
  } else {
    config.audioPath = fixWindowsPath(value);
    saveConfig();
    console.log("\nNew audio Path Set:", `"${value}"`);
  }

  process.exit();
} else {
  const [, , ...arg] = process.argv;
  console.error(`\nInvalid option: ${arg}`);
  process.exit();
}
