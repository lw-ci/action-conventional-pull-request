import * as core from '@actions/core';

export function parseConfig() {
  const githubToken = process.env.GITHUB_TOKEN ?? '';
  const configFile: string = core.getInput('config_file');

  const ignoreLabels: Array<string> = core.getMultilineInput(
    core.getInput('ignore_labels'),
  );

  const baseConfig: string =
    core.getInput('base_config') || '@commitlint/config-conventional';

  return {
    configFile,
    ignoreLabels,
    baseConfig,
    githubToken,
  };
}

export type CustomActionConfig = ReturnType<typeof parseConfig>;
