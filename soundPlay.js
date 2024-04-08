import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/* MAC PLAY COMMAND */
const macPlayCommand = (path, volume) => `afplay \"${path}\" -v ${volume}`;

/* WINDOW PLAY COMMANDS */
const addPresentationCore = `Add-Type -AssemblyName presentationCore;`;
const createMediaPlayer = `$player = New-Object system.windows.media.mediaplayer;`;
const loadAudioFile = (path) => `$player.open('${path}');`;
const playAudio = `$player.Play();`;
const stopAudio = `Start-Sleep 1; Start-Sleep -s $player.NaturalDuration.TimeSpan.TotalSeconds; $player.Stop(); Exit;`;

const windowPlayCommand = (path, volume) =>
  `powershell -c ${addPresentationCore} ${createMediaPlayer} ${loadAudioFile(
    path
  )} $player.Volume = ${volume}; ${playAudio} ${stopAudio}`;

export const play = async (path, volume = 0.5) => {
  /**
   * Window: mediaplayer's volume is from 0 to 1, default is 0.5
   * Mac: afplay's volume is from 0 to 255, default is 1. However, volume > 2 usually result in distortion.
   * Therefore, it is better to limit the volume on Mac, and set a common scale of 0 to 1 for simplicity
   */
  const volumeAdjustedByOS =
    process.platform === "darwin" ? Math.min(2, volume * 2) : volume;

  const playCommand =
    process.platform === "darwin"
      ? macPlayCommand(path, volumeAdjustedByOS)
      : windowPlayCommand(path, volumeAdjustedByOS);
  try {
    await execPromise(playCommand);
  } catch (err) {
    throw err;
  }
};

export const stop = async () => {
  const stopCommand =
    process.platform === "darwin"
      ? "killall afplay"
      : `Get-PSSession -ComputerName $computerName -Credential $credential | Disconnect-PSSession | Remove-PSSession
The Remove-PSSession cmdlet closes PowerShell sessions (PSSession`;
  try {
    await execPromise(stopCommand);
  } catch (err) {
    console.error("Error while stopping audio playback:", err);
  }
};
