#!/usr/bin/env node

import chalk from "chalk";
import { getProjectConfig } from "./prompt.js";
import {generateProject} from './generator.js'

console.log(chalk.cyan.bold("\n🚀 Express Backend Generator"));
console.log(chalk.yellow("Scaffold a production-ready Express backend in seconds.\n"));
console.log(chalk.gray("───────────────────────────────────────────────────────\n"));
console.log(chalk.bold("Project Configuration\n"));

const projectName = process.argv[2];

const config=await getProjectConfig(projectName)

await generateProject(config)

