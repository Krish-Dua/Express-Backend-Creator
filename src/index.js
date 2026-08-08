#!/usr/bin/env node

import chalk from "chalk";
import { getProjectConfig } from "./prompt.js";
import {generateProject} from './generator.js'

console.log(chalk.cyan.bold("\n🚀 Express Backend Generator"));
console.log(chalk.yellow("Scaffold a production-ready Express backend in seconds.\n"));
console.log(chalk.gray("───────────────────────────────────────────────────────\n"));
console.log(chalk.bold("Project Configuration\n"));
global.scaffoldingDone = false;

process.on("SIGINT", () => {
  if (!global.scaffoldingDone) {
    console.log(chalk.red("\n\nScaffolding cancelled !\n"));
  }
  process.exit(0);
});

const projectName = process.argv[2];

try {
  const config = await getProjectConfig(projectName);
  await generateProject(config);
} catch (error) {
  if (error.message && (error.message.includes("closed") || error.message.includes("cancel") || error.message.includes("force"))) {
    if (!global.scaffoldingDone) {
      console.log(chalk.red("\n\nScaffolding cancelled !\n"));
    }
  } else {
    console.error(chalk.red("\nAn error occurred:"), error.message || error);
  }
  process.exit(1);
}
