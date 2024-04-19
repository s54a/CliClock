// notifyTimer.js

import path from "path";
import { fileURLToPath } from "url";
import notifier from "node-notifier";
import { clearInterval } from "timers";
import { stopSound } from "./soundFunctions.js";
import runCommand from "./runCommand.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function notifyTimer(formattedTime, interval) {
  const icon = path.join(__dirname, "../timer-svgrepo-com.png");
  notifier.notify({
    title: "Timer Expired",
    message: `Timer set for ${formattedTime} has expired.`,
    sound: false, // Enable sound
    wait: true, // Wait for notification to be dismissed
    icon: icon, // Path to icon file
    contentImage: icon, // Same as icon
    actions: ["Snooze for 3 Minutes", "Stop Timer"],
  });

  notifier.on("dismissed", () => {
    clearInterval(interval);
    stopSound();
    console.log("Timer Stopped");
    process.exit();
  });

  // Buttons actions (lower-case):
  notifier.on("snooze for 3 minutes", () => {
    clearInterval(interval);
    stopSound();
    runCommand("t 3m");
  });

  notifier.on("stop timer", () => {
    clearInterval(interval);
    stopSound();
    console.log("Timer Stopped");
    process.exit();
  });
}
