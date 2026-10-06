import fs from "node:fs";
import path from "node:path";

const CORE_ITEMS = [
    "api.json",
    "engine",
    "external-api",
    "internal-working",
    "source.json",
    "index.js"
];

const startFunc = ({ inSourceDir, inTargetDir }) => {
    const localSourceDir = inSourceDir;
    const localTargetDir = inTargetDir;

    if (!fs.existsSync(localTargetDir)) {
        fs.mkdirSync(localTargetDir, { recursive: true });
    }

    const copied = [];

    for (const item of CORE_ITEMS) {
        const sourcePath = path.join(localSourceDir, item);
        const targetPath = path.join(localTargetDir, item);

        if (fs.existsSync(sourcePath)) {
            fs.cpSync(sourcePath, targetPath, { recursive: true });
            copied.push(item);
        }
    }

    return copied;
};

export default startFunc;
