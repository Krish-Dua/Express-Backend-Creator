import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function loadFeature(featureName) {

    const featurePath = path.join(
        __dirname,
        "..",
        "templates",
        "features",
        featureName,
        "feature.json"
    );


    if (!await fs.pathExists(featurePath)) {
        throw new Error(
            `Feature "${featureName}" does not exist`
        );
    }


    return await fs.readJson(featurePath);
}