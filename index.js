#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import notifier from "node-notifier";
import { execSync } from "child_process";
import sound from "sound-play";

// Get current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Command line arguments
const [, , arg, value] = process.argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Extracting time and unit from value
const time = parseInt(arg);

if (time <= 0) {
  console.error("Time must be a Positive Value.");
  process.exit();
}

// let stopwatchInterval;
let interval;

function stop() {
  const stop = () => {
    clearInterval(interval);
    process.stdin.removeListener("keypress", stopHandler);
    console.log("CLI Clock Stopped.");
    process.exit();
  };

  const stopHandler = (str, key) => {
    if (key.name === "return") {
      stop();
    }
  };

  // Listen for "keypress" event on stdin
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("keypress", stopHandler);
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
  setInterval(displayTime, 1000);
  stop();
} else if (arg === "-s") {
  if (value) {
    console.error("You don't have to pass a value with this flag");
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
  interval = setInterval(displayStopwatch, 1000);

  stop();
} else if (arg === "-h") {
  if (value) {
    console.error("You don't have to pass a value with this flag");
    process.exit();
  }
  console.log("test");
  stop();
} else if (time) {
  const unitMatch = arg.match(/[a-zA-Z]+/);
  const unit = unitMatch ? unitMatch[0] : null;

  if (isNaN(time)) {
    console.error("Passed Value must be a number.");
    process.exit();
  }

  if (!unit) {
    console.error("Invalid time format.");
    process.exit();
  }
  if (value) {
    console.error("You don't need pass any Arguments after Time");
    process.exit();
  }

  let timeValuePassed;
  switch (unit.toLocaleLowerCase()) {
    case "m":
      timeValuePassed = time * 60 * 1000; // Convert minutes to milliseconds
      break;
    case "s":
      timeValuePassed = time * 1000; // Convert seconds to milliseconds
      break;
    case "h":
      timeValuePassed = time * 60 * 60 * 1000; // Convert hours to milliseconds
      break;
    case "ms":
      timeValuePassed = time; // Milliseconds
      break;
    default:
      console.error("Invalid time unit.");
      process.exit();
  }

  // let displayCountdownInterval;

  const startTimer = () => {
    const endTime = Date.now() + timeValuePassed;
    const displayCountdown = () => {
      clearInterval(interval);
      const remainingTime = endTime - Date.now();
      const secondsRemaining = Math.ceil(remainingTime / 1000);

      console.clear();
      console.log(`
Timer set for ${time} ${unit}
Time remaining:  ${secondsRemaining} Seconds
      `);

      if (secondsRemaining > 0) {
        interval = setInterval(displayCountdown, 500);
      } else if (secondsRemaining <= 0) {
        clearInterval(interval);
        console.clear();
        console.log(`
Timer set for ${time} ${unit}
Time remaining: 0 seconds
      `);
        console.log("Timer ended!");

        const icon = path.join(__dirname, "timer-svgrepo-com.png");
        const soundPath = path.join(__dirname, "sound.mp3");
        notifier.notify({
          title: "Timer Expired",
          message: `Timer set for ${time}${unit} has expired.`,
          sound: false, // Enable sound
          wait: true, // Wait for notification to be dismissed
          icon: icon, // Path to icon file
          contentImage: icon, // Same as icon
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
            console.log(`Snoozing for ${snoozeTime}${snoozeUnit}`);

            const command = `t ${snoozeTime}${snoozeUnit}`;

            const runCommand = (command) => {
              try {
                execSync(`${command}`, { stdio: "inherit" });
              } catch (error) {
                console.log(`Failed to Excute Command ${command}`);
                process.exit();
              }
            };

            runCommand(command);

            rl.close();
          } else {
            console.log("Invalid snooze duration format. Snooze not applied.");
            rl.close();
          }
        };

        rl.question("Snooze Timer for: ", handleSnoozeInput);
      }
    };
    displayCountdown();
  };

  startTimer();

  stop();
} else {
  const [, , ...arg] = process.argv;
  console.error(`Invalid option: ${arg}`);
  process.exit();
}
