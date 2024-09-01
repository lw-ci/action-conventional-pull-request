import * as core from '@actions/core';
import * as github from '@actions/github';

import { formatReport, lintTitle } from './lint.js';
import { parseConfig } from './helpers.js';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const config = parseConfig();
    const { githubToken, ignoreLabels } = config;

    const client = github.getOctokit(githubToken);

    const prContext = github.context.payload.pull_request;
    if (!prContext) {
      throw new Error(
        '`pull_request_target` or `pull_request` events are required to execute this action.',
      );
    }

    const owner = prContext.base.user.login;
    const repo = prContext.base.repo.name;

    const { data: pullRequest } = await client.rest.pulls.get({
      owner,
      repo,
      pull_number: prContext.number,
    });

    core.setOutput('skipped', 'true');
    core.setOutput('valid', 'true');
    core.setOutput('pr_title', pullRequest.title);
    core.setOutput('pr_number', pullRequest.number.toString());

    if (ignoreLabels) {
      const labelNames = pullRequest.labels.map((label) => label.name);
      for (const labelName of labelNames) {
        if (ignoreLabels.includes(labelName)) {
          core.info(
            `Validation was skipped because the PR label "${labelName}" was found.`,
          );

          return;
        }
      }
    }
    const report = await lintTitle({ input: pullRequest.title }, config);

    const outcomes = [report];

    const formattedReport = await formatReport(outcomes);

    core.debug(JSON.stringify(report, null, 2));
    core.info(formattedReport);

    core.setOutput('skipped', 'false');
    core.setOutput('valid', report.valid.toString());
    core.setOutput('outcomes', JSON.stringify(outcomes));
    core.setOutput('report', formattedReport);

    if (!report.valid) {
      throw new Error(
        `The following pull request title failed validation: "${report.input}"`,
      );
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
