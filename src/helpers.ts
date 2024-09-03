import * as core from '@actions/core';

export function parseConfig() {
  const githubToken = process.env.GITHUB_TOKEN ?? '';
  const configFile: string = core.getInput('config_file');

  return {
    configFile,
    githubToken,
  };
}

export type CustomActionConfig = ReturnType<typeof parseConfig>;
