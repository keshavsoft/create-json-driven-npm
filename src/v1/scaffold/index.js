import findSourceTemplate from "./findSourceTemplate.js";
import copyTemplate from "./copyTemplate.js";

const startFunc = ({ inTargetDir }) => {
    const localTargetDir = inTargetDir;

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
