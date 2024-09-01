import * as core from '@actions/core';
const ENUM_SPLIT_REGEX = /\n/;
function parseNewLineList(input) {
    return input
        .split(ENUM_SPLIT_REGEX)
        .map((part) => part.trim())
        .filter(Boolean);
}
export function parseConfig() {
    const githubToken = process.env.GITHUB_TOKEN ?? '';
    const configFile = core.getInput('config_file');
    const ignoreLabels = parseNewLineList(core.getInput('ignore_labels'));
    const baseConfig = core.getInput('base_config') || '@commitlint/config-conventional';
    return {
        configFile,
        ignoreLabels,
        baseConfig,
        githubToken,
    };
}
//# sourceMappingURL=helpers.js.map