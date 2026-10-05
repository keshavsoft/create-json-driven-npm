import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const versionPattern = /^v(\d+)$/;

const startFunc = () => {
    const packageJsonUrl = import.meta.resolve("json-driven-npm/package.json");
    const packageJsonPath = fileURLToPath(packageJsonUrl);
    const packageRoot = path.dirname(packageJsonPath);
    const srcDirectory = path.join(packageRoot, "src");

    const versions = fs.readdirSync(srcDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && versionPattern.test(entry.name))
        .map((entry) => ({
            name: entry.name,
            number: Number(entry.name.slice(1)),
            directory: path.join(srcDirectory, entry.name)
        }))
        .sort((left, right) => right.number - left.number);

    if (versions.length === 0) {
        throw new Error(`No version directories found in ${srcDirectory}`);
    }

    return versions[0];
};

export default startFunc;
