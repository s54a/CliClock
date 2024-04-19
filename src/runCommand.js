import { execSync } from "child_process";

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.log(`Failed to Execute Command ${command}`);
    process.exit();
  }
};

export default runCommand;
