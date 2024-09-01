import * as core from '@actions/core';

const ENUM_SPLIT_REGEX = /\n/;

function parseNewLineList(input: string) {
  return input
    .split(ENUM_SPLIT_REGEX)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseConfig() {
  const githubToken = process.env.GITHUB_TOKEN ?? '';
  const configFile: string = core.getInput('config_file');

  const ignoreLabels: Array<string> = parseNewLineList(
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
