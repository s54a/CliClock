#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import notifier from "node-notifier";
import { execSync } from "child_process";
import { spawn } from "child_process";
import inquirer from "inquirer";

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
  process.exit(1);
}

let interval;

function exitCliClock() {
  const stopHandler = (key) => {
    if (key === "\u001B") {
      // Escape key
      clearInterval(interval);
      console.log("CLI Clock Stopped.");
      process.stdin.removeListener("data", stopHandler); // Remove the event listener
      process.exit();
    }
  };

  // Listen for "keypress" event on stdin
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", stopHandler);
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
  exitCliClock();
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

  exitCliClock();
} else if (arg === "-h") {
  if (value) {
    console.error("You don't have to pass a value with this flag");
    process.exit();
  }

  console.log("test");

  exitCliClock();
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

  const configFilePath = path.join(__dirname, "config.json");

  function findExecutablePath(possiblePaths) {
    // Find the first existing path
    return possiblePaths.find((path) => fs.existsSync(path));
  }

  function getVLCPath() {
    let vlcPath;
    // Determine the VLC executable path based on the user's operating system
    if (process.platform === "win32") {
      // Windows paths
      const possibleWindowsPaths = [
        "C:/Program Files/VideoLAN/VLC/vlc.exe", // Default installation path
        "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe", // Alternative installation path for 32-bit systems
        // Add more possible paths here if needed
      ];
      vlcPath = findExecutablePath(possibleWindowsPaths);
    } else if (process.platform === "darwin") {
      // macOS paths
      const possibleMacPaths = [
        "/Applications/VLC.app/Contents/MacOS/VLC", // Default installation path
        "/Applications/VLC.app/Contents/MacOS/VLC/Contents/MacOS/VLC", // Alternative installation path
        // Add more possible paths here if needed
      ];
      vlcPath = findExecutablePath(possibleMacPaths);
    } else if (process.platform === "linux") {
      // Linux paths
      const possibleLinuxPaths = [
        "/usr/bin/vlc", // Default path on many distributions
        "/usr/local/bin/vlc", // Common alternative path
        "/snap/bin/vlc", // Path for Snap installations
        "/var/lib/flatpak/exports/bin/vlc", // Path for Flatpak installations
        // Add more possible paths here if needed
      ];
      vlcPath = findExecutablePath(possibleLinuxPaths);
    } else {
      console.error("Unsupported operating system");
      process.exit(1);
    }

    const configFilePath = path.join(__dirname, "config.json");

    // Function to read VLC path from config file
    function readVLCPathFromConfigFile() {
      try {
        const configFileData = fs.readFileSync(configFilePath, "utf8");
        const config = JSON.parse(configFileData);
        return config.vlcPath;
      } catch (error) {
        return null; // Return null if config file doesn't exist or is invalid
      }
    }

    vlcPath = readVLCPathFromConfigFile();

    if (!vlcPath) {
      console.clear();
      console.error(
        `
What has happened is:

When the Timer Ends it Plays an Audio.
For which it uses VlC Media Player.
And the Guessed Paths didn't work so you can enter a Path for VLC on your System

Example: "C:/Program Files/VideoLAN/VLC/vlc.exe"

If you answer "no" it will start the timer but won't play any sound 

So please specify the path to the VLC executable.

`
      );
      function promptForVLCPath() {
        return inquirer
          .prompt({
            type: "input",
            name: "vlcPath",
            message: "Enter the path to VLC executable: ",
            validate: (input) => {
              if (input.toLowerCase() === "no") {
                return true;
              } else if (!fs.existsSync(input)) {
                return "Invalid VLC executable path.";
              }
              return true;
            },
          })
          .then((answer) => {
            if (answer.vlcPath.toLowerCase() === "no") {
              return "no";
            } else if (!fs.existsSync(answer.vlcPath)) {
              console.error("Invalid VLC executable path.");
              return promptForVLCPath(); // Re-prompt if path is invalid
            }
            return answer.vlcPath;
          });
      }

      vlcPath = promptForVLCPath();
    }

    return vlcPath;
  }

  const vlcPath = await getVLCPath();

  // Function to save VLC path to config file
  function saveVLCPathToConfigFile(vlcPath) {
    const config = { vlcPath };
    fs.writeFileSync(configFilePath, JSON.stringify(config));
  }

  if (vlcPath === "no") {
    console.log("\nVLC path not provided");
    console.log("\nSound won't Play when the Timer Ends");
    saveVLCPathToConfigFile(vlcPath);
  } else {
    console.log("VLC path entered:", vlcPath);
    saveVLCPathToConfigFile(vlcPath);
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

        const audioFile = path.join(__dirname, "./audio.mp3");

        let playerProcess;

        // Function to play sound
        function playSound(audioFile) {
          // Spawn the VLC player process
          playerProcess = spawn(vlcPath, ["--intf", "dummy", audioFile]);
        }

        // Function to stop sound playback
        function stopSound() {
          if (playerProcess) {
            // Send a SIGTERM signal to terminate the process
            playerProcess.kill("SIGTERM");
          }
        }

        if (vlcPath !== "no") {
          playSound(audioFile);
        }
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
            if (vlcPath !== "no") {
              stopSound();
            }
            console.log(`Snoozing for ${snoozeTime}${snoozeUnit}`);

            const command = `t ${snoozeTime}${snoozeUnit}`;

            const runCommand = (command) => {
              try {
                execSync(`${command}`, { stdio: "inherit" });
              } catch (error) {
                console.log(`Failed to Execute Command ${command}`);
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

  if (vlcPath) {
    startTimer();
    exitCliClock();
  } else {
    console.log("VLC path not found. Exiting...");
    process.exit();
  }
} else {
  const [, , ...arg] = process.argv;
  console.error(`Invalid option: ${arg}`);
  process.exit();
}
