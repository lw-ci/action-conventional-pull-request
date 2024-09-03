import * as core from '@actions/core';
export function parseConfig() {
    const githubToken = process.env.GITHUB_TOKEN ?? '';
    const configFile = core.getInput('config_file');
    return {
        configFile,
        githubToken,
    };
}
//# sourceMappingURL=helpers.js.map