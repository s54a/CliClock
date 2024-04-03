#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import notifier from "node-notifier";
import readLine from "readline";

// Get current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Command line arguments
const [, , condition, value] = process.argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!condition) {
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
} else if (condition === "-t") {
  if (!value) {
    console.error("Please Enter a Value");
    process.exit(1);
  }

  // Extracting time and unit from value
  const time = parseInt(value);
  const unitMatch = value.match(/[a-zA-Z]+/);
  const unit = unitMatch ? unitMatch[0] : null;

  if (isNaN(time)) {
    console.error("Passed Value must be a number.");
    process.exit(1);
  }

  if (!unit) {
    console.error("Invalid time format.");
    process.exit(1);
  }

  let valuePassed;
  switch (unit.toLocaleLowerCase()) {
    case "m":
      valuePassed = time * 60 * 1000; // Convert minutes to milliseconds
      break;
    case "s":
      valuePassed = time * 1000; // Convert seconds to milliseconds
      break;
    case "h":
      valuePassed = time * 60 * 60 * 1000; // Convert hours to milliseconds
      break;
    case "ms":
      valuePassed = time; // Milliseconds
      break;
    default:
      console.error("Invalid time unit.");
      process.exit(1);
  }
  console.log(`Timer set for ${time} ${unit}`);

  // Calculate end time for countdown
  const endTime = Date.now() + valuePassed;
  // Function to display countdown
  const displayCountdown = () => {
    const remainingTime = endTime - Date.now();
    const secondsRemaining = Math.ceil(remainingTime / 1000);
    if (secondsRemaining <= 0) {
      console.clear();
      console.log(`
Timer set for ${time} ${unit}
Time remaining: 0 seconds
      `);
      console.log("Timer ended!");
      clearInterval(countdownInterval); // Stop the countdown
      const icon = path.join(__dirname, "timer-svgrepo-com.png");
      const soundPath = path.join(__dirname, "sound.mp3");
      // Play sound when the timer expires
      notifier.notify({
        title: "Timer Expired",
        message: `Timer set for ${time}${unit} has expired.`,
        // sound: true, // Enable sound
        wait: true, // Wait for notification to be dismissed
        sound: soundPath, // Path to custom sound file
        icon: icon, // Path to icon file
        contentImage: icon, // Same as icon
      });
      rl.question("Snooze duration (e.g. 10s, 5m): ", (answer) => {
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
          console.log(`Snoozing for ${snoozeTime} ${snoozeUnit}`);
          endTime = Date.now() + snoozeMilliseconds; // Update end time for snooze
        } else {
          console.log("Invalid snooze duration format. Snooze not applied.");
        }
        rl.close();
      });
    } else {
      console.clear();
      console.log(`
      Timer set for ${time} ${unit}
      Time remaining: ${secondsRemaining} seconds
      `);
    }
  };

  // Display countdown every second
  // const countdownInterval = setInterval(displayCountdown, 100);
  // Function to start the timer
  const startTimer = (duration) => {
    endTime = Date.now() + duration;
    countdownInterval = setInterval(displayCountdown, 100);
  };

  // Initial call to start the timer
  startTimer(valuePassed);
} else if (condition === "-s") {
  if (value) {
    console.error("You don't have to pass a value with this flag");
    process.exit(1);
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

  // Display stopwatch every second
  const stopwatchInterval = setInterval(displayStopwatch, 1000);
} else if (condition === "-h") {
  if (value) {
    console.error("You don't have to pass a value with this flag");
    process.exit(1);
  }
} else {
  console.error(`Invalid option: ${condition}`);
  process.exit(1);
}
