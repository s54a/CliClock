import { spawn } from "child_process";
import config from "./config.js";

let playerProcess;

// Function to play sound
function playSound() {
  // Spawn the VLC player process
  playerProcess = spawn(config.vlcExePath, [
    "--intf",
    "dummy",
    config.audioPath,
  ]);
}

// Function to stop sound playback
function stopSound() {
  if (playerProcess) {
    // Send a SIGTERM signal to terminate the process
    playerProcess.kill("SIGTERM");
  }
}

export { playSound, stopSound };
