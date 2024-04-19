import fs from "fs";
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
        "Unsupported operating system. To play Sound you can add path for VLC.exe Manually using the --new-path."
      );
      config.vlcExePath = "no";
      vlcPath = "no";
      saveConfig();
    }
  }

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

  config.vlcExePath = vlcPath;

  return vlcPath;
}

export default getVLCPath;
