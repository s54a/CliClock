#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { playAudioFile } from "audic";

// Get current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Command line arguments
const [, , condition, value] = process.argv;

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
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
  // Code for Timer
} else if (condition === "-t") {
  if (!value) {
    console.error("Please Enter a Value");
    process.exit(1);
  }

  const [time, unit] = value.split(" ");

  if (isNaN(parseInt(time))) {
    console.error("Passed Value must be a number.");
    process.exit(1);
  }
  let valuePassed;
  switch (unit) {
    case "m":
      valuePassed = parseInt(time) * 60 * 1000; // Convert minutes to milliseconds
      break;
    case "s":
      valuePassed = parseInt(time) * 1000; // Convert seconds to milliseconds
      break;
    case "h":
      valuePassed = parseInt(time) * 60 * 60 * 1000; // Convert hours to milliseconds
      break;
    case "ms":
      valuePassed = parseInt(time); // Milliseconds
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
    console.clear();
    console.log(`
    Timer set for ${time} ${unit}
    Time remaining: ${secondsRemaining} seconds
    `);
  };

  // Display countdown every second
  const countdownInterval = setInterval(displayCountdown, 100);

  // setTimeout to trigger an action after the specified time interval
  setTimeout(() => {
    clearInterval(countdownInterval); // Stop the countdown
    console.log("Timer expired!");

    // Play sound when the timer expires
    playAudioFile("sound.mp3");
  }, valuePassed);

  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
  // Code for Stopwatch
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
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
  // Code for Help
} else if (condition === "-h") {
  if (value) {
    console.error("You don't have to pass a value with this flag");
    process.exit(1);
  }
} else {
  console.error(`Invalid option: ${condition}`);
  process.exit(1);
}
