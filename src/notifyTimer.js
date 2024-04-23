import path from "path";
import { fileURLToPath } from "url";
import notifier from "node-notifier";
import { clearInterval } from "timers";
import chalk from "chalk";
import { stopSound } from "./soundFunctions.js";
import runCommand from "./runCommand.js";
import config from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (config.vlcExePath === "no") {
  // Disable sound if VLC executable path is "no"
  notifyTimer.soundEnabled = true;
} else {
  notifyTimer.soundEnabled = false;
}

export default function notifyTimer(formattedTime, interval) {
  const icon = path.join(__dirname, "../timer-svgrepo-com.png");
  notifier.notify({
    title: "Timer Expired",
    message: `Timer set for ${formattedTime} has expired.`,
    sound: notifyTimer.soundEnabled, // Set sound based on config.vlcExePath
    wait: true, // Wait for notification to be dismissed
    icon: icon, // Path to icon file
    contentImage: icon, // Same as icon
    actions: ["Snooze for 3 Minutes", "Stop Timer"],
  });

  notifier.on("dismissed", () => {
    clearInterval(interval);
    stopSound();
    console.log(chalk.yellow("Timer Stopped"));
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
    console.log(chalk.red("Timer Stopped"));
    process.exit();
  });
}
