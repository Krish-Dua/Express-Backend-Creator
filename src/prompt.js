import inquirer from "inquirer";
import path from "path";

export async function getProjectConfig(projectName) {
    let useCurrentDirectory = false;

    if (projectName === ".") {
        projectName = path.basename(process.cwd());
        useCurrentDirectory = true;
    }

    // Project Name
    if (!projectName) {
        const { projectName: enteredProjectName } = await inquirer.prompt([
            {
                type: "input",
                name: "projectName",
                message: "Project name:",
                default: "my-app",
            },
        ]);

        projectName = enteredProjectName;
    console.log();

    }


    const { structure } = await inquirer.prompt([
        {
            type: "select",
            name: "structure",
            message: "Where should your source code live?",
            choices: [
                {
                    name: "src (Inside a src folder)",
                    value: "src",
                },
                {
                    name: "root (In the project root)",
                    value: "root",
                },
            ],
            default: "src",
        },
    ]);

    console.log();

    const { database } = await inquirer.prompt([
        {
            type: "select",
            name: "database",
            message: "Database:",
            choices: [
                {
                    name: "MongoDB",
                    value: "mongodb",
                },
                {
                    name: "None",
                    value: "none",
                },
            ],
            default: "mongodb",
        },
    ]);

    console.log();

    const { postSetup } = await inquirer.prompt([
        {
            type: "select",
            name: "postSetup",
            message: "After project creation:",
            choices: [
                {
                    name: "Install dependencies & start development server",
                    value: "install-and-run",
                },
                {
                    name: "Install dependencies only",
                    value: "install",
                },
                {
                    name: "I'll do it myself",
                    value: "skip",
                },
            ],
            default: "install-and-run",
        },
    ]);

    return {
        projectName,
        structure,
        database,
        postSetup,
        useCurrentDirectory,
    };
}