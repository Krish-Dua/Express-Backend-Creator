import ora from "ora";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { loadFeature } from "./featureLoader.js";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

async function updatePackageJson(targetDirectory, config, features) {
  const packageJsonPath = path.join(targetDirectory, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = config.projectName;

  for (const feature of features) {
    if (feature.dependencies) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...feature.dependencies
      }
    }
  }
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function applyFeature(targetDirectory, feature, config) {
  const featurePath = path.join(__dirname, "..", "templates", "features", feature.name);
  if (feature.copy && feature.copy.length > 0) {
    for (const item of feature.copy) {
      await fs.copy(path.join(featurePath, item), config.structure === "root" ? path.join(targetDirectory, item) : path.join(targetDirectory, "src", item));
    }
  }
  if (feature.server) {
    await updateServerFile(targetDirectory, feature, config);
  }
  if (feature.env) {
    await updateEnv(targetDirectory, feature);
  }
}
async function updateServerFile(targetDirectory, feature, config) {
  if (!feature.server) return;
  const serverFilePath = config.structure === "root" ? path.join(targetDirectory, "server.js") : path.join(targetDirectory, "src", "server.js");
  let serverContent = await fs.readFile(serverFilePath, "utf-8");

  if (feature.server.imports) {

    serverContent = serverContent.replace(
      "// <DATABASE_IMPORT>",
      feature.server.imports
    );

  }

  if (feature.server.connection) {

    serverContent = serverContent.replace(
      "// <DATABASE_CONNECTION>",
      feature.server.connection
    );

  }


  await fs.writeFile(
    serverFilePath,
    serverContent
  );

}

export async function cleanupPlaceholders(
  targetDirectory,
  config
) {

  const serverFilePath = config.structure === "root"
    ? path.join(targetDirectory, "server.js")
    : path.join(targetDirectory, "src", "server.js");


  let serverContent = await fs.readFile(
    serverFilePath,
    "utf-8"
  );


  serverContent = serverContent.replace(
    /\/\/ <.*?>/g,
    ""
  );


  await fs.writeFile(
    serverFilePath,
    serverContent
  );
}

export async function runPostSetup(
  targetDirectory,
  config
) {

  if (config.postSetup === "skip") {
    return;
  }

  if (
    config.postSetup === "install" ||
    config.postSetup === "install-and-run"
  ) {
    const installSpinner = ora("Installing dependencies with npm... (this may take a few seconds)").start();

    try {
      const { stdout } = await execAsync(
        "npm install",
        {
          cwd: targetDirectory
        }
      );
      installSpinner.succeed(chalk.bgYellow("Dependencies installed successfully."));
      if (stdout) {
        console.log(stdout);
      }
    } catch (error) {
      installSpinner.fail(chalk.red("Failed to install dependencies."));
      console.error(chalk.red(error.stderr || error.message));
      process.exit(1);
    }
  }

  if (config.postSetup === "install-and-run") {
    console.log(chalk.cyan("\n🚀 Starting development server...\n"));

    const command = process.platform === "win32"
        ? "cmd"
        : "npm";

    const args = process.platform === "win32"
        ? ["/c", "npm", "run", "dev"]
        : ["run", "dev"];

    spawn(command, args, {
        cwd: targetDirectory,
        stdio: "inherit"
    });
  }
}
export async function updateEnv(
  targetDirectory,
  feature
) {

  if (!feature.env) return;


  const envPath = path.join(
    targetDirectory,
    ".env"
  );


  let envContent = "";

  if (await fs.pathExists(envPath)) {
    envContent = await fs.readFile(
      envPath,
      "utf-8"
    );
  }


  for (const [key, value] of Object.entries(feature.env)) {
    envContent += `\n${key}=${value}`;
  }


  await fs.writeFile(
    envPath,
    envContent.trim() + "\n"
  );

}

export async function generateProject(config) {

  const features = [];

  const targetDirectory = config.useCurrentDirectory
    ? process.cwd()
    : path.join(process.cwd(), config.projectName);

  console.log();

  const exists = await fs.pathExists(targetDirectory);
  const spinner = ora("Checking directory availability...").start();

  if (exists && !config.useCurrentDirectory) {
    spinner.fail(chalk.red(`Directory "${config.projectName}" already exists.`));
    process.exit(1);
  }

  if (!config.useCurrentDirectory) {
    await fs.ensureDir(targetDirectory);
  }

  spinner.text = "Generating Project files...";
  const targetTemplate = path.join(__dirname, "..", "templates", config.structure);
  await fs.copy(targetTemplate, targetDirectory);

  if (config.database === "mongodb") {
    const mongodbFeature = await loadFeature("mongodb");
    features.push(mongodbFeature);
  }

  await updatePackageJson(targetDirectory, config, features);

  for (const feature of features) {
    await applyFeature(targetDirectory, feature, config);
  }

  await cleanupPlaceholders(
    targetDirectory,
    config
  );

  spinner.succeed(chalk.bgYellow("Project scaffolding complete."));
  console.log();

  global.scaffoldingDone = true;

  await runPostSetup(
    targetDirectory,
    config
  );

  if (config.postSetup === "install") {
    console.log(chalk.bold.cyan("\n👉 To run the server:"));
    if (!config.useCurrentDirectory) {
      console.log(`   ${chalk.gray("$")} ${chalk.yellow(`cd ${config.projectName}`)}`);
    }
    console.log(`   ${chalk.gray("$")} ${chalk.yellow("npm run dev")} or ${chalk.yellow("npm start")}`);
    console.log();
  }

  if (config.postSetup === "skip") {
    console.log(chalk.bold.cyan("\n👉 To run the server:"));
    if (!config.useCurrentDirectory) {
      console.log(`   ${chalk.gray("$")} ${chalk.yellow(`cd ${config.projectName}`)}`);
    }
    console.log(`   ${chalk.gray("$")} ${chalk.yellow("npm install")}`);
    console.log(`   ${chalk.gray("$")} ${chalk.yellow("npm run dev")} or ${chalk.yellow("npm start")}`);
    console.log();
  }
}
