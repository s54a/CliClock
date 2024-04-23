import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";
import saveConfig from "./saveConfig.js";
import config from "./config.js";

function findExecutablePath(possiblePaths) {
  // Find the first existing path
  return possiblePaths.find((path) => fs.existsSync(path));
}

function getVLCPath() {
  let vlcPath = config.vlcExePath;
  // Determine the VLC executable path based on the user's operating system
  if (!config.vlcExePath) {
    if (process.platform === "win32") {
      // Windows paths
      const possibleWindowsPaths = [
        "C:/Program Files/VideoLAN/VLC/vlc.exe", // Default installation path
        "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe", // Alternative installation path for 32-bit systems
        // Add more possible paths here if needed
      ];
      vlcPath = findExecutablePath(possibleWindowsPaths);
      config.vlcExePath = vlcPath;
      saveConfig();
    } else if (process.platform === "darwin") {
      // macOS paths
      const possibleMacPaths = [
        "/Applications/VLC.app/Contents/MacOS/VLC", // Default installation path
        "/Applications/VLC.app/Contents/MacOS/VLC/Contents/MacOS/VLC", // Alternative installation path
        // Add more possible paths here if needed
      ];
      vlcPath = findExecutablePath(possibleMacPaths);
      config.vlcExePath = vlcPath;
      saveConfig();
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
      config.vlcExePath = vlcPath;
      saveConfig();
    } else {
      console.error(
        chalk.red(
          "Unsupported operating system. To play Sound you can add path for VLC.exe Manually using the --new-path."
        )
      );
      config.vlcExePath = "no";
      vlcPath = "no";
      saveConfig();
    }
  }

  if (!vlcPath) {
    console.clear();

    // Explanation of the package and its functionality
    console.error(chalk.yellow.bold("\nWelcome to CLI Clock Package!\n"));
    console.log(
      chalk.green(
        "This package allows you to set timers and plays an audio file when the timer duration is over.\n"
      )
    );

    // Explanation of VLC executable path
    console.log(chalk.blue.bold("How It Works:"));
    console.log(
      "When you run this package for the first time, it tries to locate VLC.exe to play the audio. It uses common paths for VLC.exe on Windows, macOS, and Linux, but sometimes VLC.exe might be stored in a different location on your device.\n"
    );

    // Prompt for VLC executable path
    console.log(chalk.blue.bold("What to Do:"));
    console.log(
      "If the package can't find VLC.exe, that is why you are seeing this message. You can provide the path to VLC.exe on your device or enter 'no' if you don't want provide the path now and the Package will work but wont play the audio file when the timer ends there will be just Beep Sound.\n"
    );
    console.log(
      "Example Path: " + chalk.cyan('"C:/Program Files/VideoLAN/VLC/vlc.exe"')
    );
    console.log(
      "If you choose 'no', you can always provide the path for VLC.exe in the future using " +
        chalk.cyan("'t --vlc-path 'path for VLC.exe'\"") +
        "\n"
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
              console.error(chalk.red("Invalid VLC executable path."));
              return promptForVLCPath();
            }
            return true;
          },
        })
        .then((answer) => {
          config.vlcExePath = answer.vlcPath;
          saveConfig();
          return answer.vlcPath;
        });
    }

    vlcPath = promptForVLCPath();
  }

  config.vlcExePath = vlcPath;

  return vlcPath;
}

export default getVLCPath;
