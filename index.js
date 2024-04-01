#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CURR_DIR = process.cwd();

// Command line arguments
const [, , condition, value] = process.argv;

const [, , ...args] = process.argv;

const options = {
  condition: null,
  value: null,
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case "-t":
    case "-s":
      options.condition = arg;
      break;
    case "-h":
      options.condition = arg;
      options.value = "";
      break;
    default:
      if (arg.startsWith("-")) {
        console.error(`Invalid option: ${arg}`);
        process.exit(1);
      } else {
        options.value = arg;
      }
      break;
  }
}

if (!args.length) {
  options.condition = "";
  options.value = "";
}

// Check for unsupported or invalid options
if (Object.values(options).some((value) => value === null)) {
  console.error(`Missing required option or invalid usage.`);
  process.exit(1);
}

if (!condition) {
  console.log("Ran");
}
