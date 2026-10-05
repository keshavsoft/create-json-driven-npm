import fs from "node:fs";
import path from "node:path";

const CORE_ARTIFACTS = [
    "external-api",
    "internal-working",
    "source.json",
    "index.js"
];

const IGNORABLE_FILES = [
    ".git",
    ".gitignore",
    ".gitattributes",
    ".DS_Store",
    "README.md",
    "LICENSE",
    "package.json"
];

const startFunc = ({ inTargetDir, inForce = false }) => {
    const localTargetDir = inTargetDir;
    const localForce = inForce;

    if (!fs.existsSync(localTargetDir)) {
        return;
    }

    if (localForce) {
        return;
    }

    const existingArtifacts = CORE_ARTIFACTS.filter((artifact) => {
        return fs.existsSync(path.join(localTargetDir, artifact));
    });

    if (existingArtifacts.length > 0) {
        const artifactList = existingArtifacts.map((artifact) => `   - ${artifact}`).join("\n");
        throw new Error(
            `Target directory already contains existing JSON-driven artifacts:\n${artifactList}\n\n`
            + `👉 Refusing to overwrite existing code.\n`
            + `💡 Please specify an empty directory, a new version path (e.g. ./src/v13), or pass --force to overwrite.`
        );
    }

    const entries = fs.readdirSync(localTargetDir);
    const nonIgnorable = entries.filter((name) => !IGNORABLE_FILES.includes(name));

    if (nonIgnorable.length > 0) {
        const fileList = nonIgnorable.slice(0, 5).map((file) => `   - ${file}`).join("\n");
        const extraCount = nonIgnorable.length > 5 ? `\n   ...and ${nonIgnorable.length - 5} more` : "";
        throw new Error(
            `Target directory is not empty:\n${fileList}${extraCount}\n\n`
            + `👉 You can only run create-json-driven-npm in an empty folder.\n`
            + `💡 Please specify an empty directory or pass --force to overwrite.`
        );
    }
};

export default startFunc;
