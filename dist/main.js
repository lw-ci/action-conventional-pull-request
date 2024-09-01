import * as core from '@actions/core';
import * as github from '@actions/github';
import { wait } from './wait.js';
import { lintTitle } from './lint.js';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
    try {
        const githubBaseUrl = process.env.INPUT_GITHUBBASEURL ?? '';
        const githubToken = process.env.GITHUB_TOKEN ?? '';
        const ms = core.getInput('milliseconds');
        const client = github.getOctokit(githubToken, {
            baseUrl: githubBaseUrl
        });
        const contextPullRequest = github.context.payload.pull_request;
        if (!contextPullRequest) {
            throw new Error("This action can only be invoked in `pull_request_target` or `pull_request` events. Otherwise the pull request can't be inferred.");
        }
        const owner = contextPullRequest.base.user.login;
        const repo = contextPullRequest.base.repo.name;
        // The pull request info on the context isn't up to date. When
        // the user updates the title and re-runs the workflow, it would
        // be outdated. Therefore fetch the pull request via the REST API
        // to ensure we use the current title.
        const { data: pullRequest } = await client.rest.pulls.get({
            owner,
            repo,
            pull_number: contextPullRequest.number
        });
        const report = lintTitle({ input: pullRequest.title });
        // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
        core.info(JSON.stringify(report, null, 2));
        // Log the current timestamp, wait, then log the new timestamp
        core.debug(new Date().toTimeString());
        await wait(Number.parseInt(ms, 10));
        core.debug(new Date().toTimeString());
        // Set outputs for other workflow steps to use
        core.setOutput('time', new Date().toTimeString());
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
//# sourceMappingURL=main.js.map