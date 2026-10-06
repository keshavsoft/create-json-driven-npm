import findSourceTemplate from "./findSourceTemplate.js";
import copyTemplate from "./copyTemplate.js";
import checkTargetSafety from "./checkTargetSafety.js";

const startFunc = ({ inTargetDir, inForce = false }) => {
    const localTargetDir = inTargetDir;
    const localForce = inForce;

    checkTargetSafety({
        inTargetDir: localTargetDir,
        inForce: localForce
    });

    const template = findSourceTemplate();

    const copied = copyTemplate({
        inSourceDir: template.directory,
        inTargetDir: localTargetDir
    });

    return {
        version: template.name,
        directory: template.directory,
        copied
    };
};

export default startFunc;
