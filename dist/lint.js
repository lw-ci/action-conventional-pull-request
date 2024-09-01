import load from '@commitlint/load';
import lint from '@commitlint/lint';
import format from '@commitlint/format';
function countOccurrences(inputString, targetSubstring) {
    if (!inputString || !targetSubstring)
        return 0;
    const regex = new RegExp(targetSubstring, 'g');
    const matches = inputString.match(regex);
    return matches ? matches.length : 0;
}
export async function lintTitle({ input }, config) {
    const CONFIG = {
        extends: [config.baseConfig, config.configFile].filter(Boolean),
    };
    const opts = await load(CONFIG);
    const customPlugins = opts.plugins ?? {};
    const lintOptions = {
        plugins: {
            'actions-conventional-pull-request': {
                rules: {
                    /**
                     * This rule checks if the commit subject starts with the commit type.
                     *
                     * Samples:
                     * Invalid => fix: fix something
                     * Correct => fix: something
                     */
                    'duplicate-type-subject-start': (props) => {
                        const { subject, type } = props;
                        const [startingWord] = subject ? subject.split(' ') : [];
                        return [
                            startingWord?.trim()?.toLowerCase() !== type?.toLowerCase(),
                            'Should not start subject with the commit type',
                        ];
                    },
                    /**
                     * This rule checks if the commit type is duplicated.
                     *
                     * Samples:
                     * Invalid => fix: fix: fix something
                     * Correct => fix: something
                     */
                    'duplicate-commit-type': (props) => {
                        const { type, header } = props;
                        const occurrences = countOccurrences(header?.toString() ?? '', `${type}:`);
                        return [occurrences < 2, 'Should not duplicate the commit type'];
                    },
                },
            },
            ...customPlugins,
        },
        parserOpts: opts.parserPreset ? opts.parserPreset.parserOpts : undefined,
    };
    const report = await lint(input, {
        ...opts.rules,
    }, lintOptions);
    return report;
}
export async function convertLintOutcomesToReportResults(outcomes) {
    return outcomes.map((outcome) => {
        return {
            errors: outcome.errors,
            warnings: outcome.warnings,
            input: outcome.input,
        };
    });
}
export async function formatReport(reportResults) {
    return format({
        results: reportResults,
    });
}
//# sourceMappingURL=lint.js.map