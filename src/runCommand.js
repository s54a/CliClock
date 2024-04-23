import { execSync } from "child_process";
import chalk from "chalk";

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.log(chalk.red(`Failed to Execute Command: ${command}`));
    process.exit();
  }
};

export default runCommand;
