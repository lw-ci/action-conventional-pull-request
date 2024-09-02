import * as core from '@actions/core';
export function parseConfig() {
    const githubToken = process.env.GITHUB_TOKEN ?? '';
    const configFile = core.getInput('config_file');
    const ignoreLabels = core.getMultilineInput(core.getInput('ignore_labels'));
    const baseConfig = core.getInput('base_config') || '@commitlint/config-conventional';
    return {
        configFile,
        ignoreLabels,
        baseConfig,
        githubToken,
    };
}
//# sourceMappingURL=helpers.js.map