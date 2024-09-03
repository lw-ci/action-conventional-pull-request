import { RuleConfigSeverity, } from '@commitlint/types';
import load from '@commitlint/load';
import lint from '@commitlint/lint';
import format from '@commitlint/format';
import * as core from '@actions/core';
function countOccurrences(inputString, targetSubstring) {
    if (!inputString || !targetSubstring)
        return 0;
    const regex = new RegExp(targetSubstring, 'g');
    const matches = inputString.match(regex);
    return matches ? matches.length : 0;
}
export async function lintTitle({ input }, config) {
    const CONFIG = {
        extends: [config.configFile].filter(Boolean),
    };
    const opts = await load(CONFIG);
    const customPlugins = opts.plugins ?? {};
    const breakingHeaderPattern = /^(\w*)(?:\((.*)\))?!: (.*)$/;
    const defaultParserOptions = {
        parserOpts: {
            headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
            breakingHeaderPattern,
            headerCorrespondence: ['type', 'scope', 'subject'],
            noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
            revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
            revertCorrespondence: ['header', 'hash'],
            issuePrefixes: ['#'],
        },
    };
    const parserOpts = {
        ...defaultParserOptions.parserOpts,
        ...(opts?.parserPreset?.parserOpts ?? {}),
    };
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
        parserOpts,
    };
    const rules = {
        'body-leading-blank': [RuleConfigSeverity.Warning, 'always'],
        'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
        'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'],
        'footer-max-line-length': [
            RuleConfigSeverity.Error,
            'always',
            100,
        ],
        'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
        'header-trim': [RuleConfigSeverity.Error, 'always'],
        'subject-case': [
            RuleConfigSeverity.Error,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
        ],
        'subject-empty': [RuleConfigSeverity.Error, 'never'],
        'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
        'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
        'type-empty': [RuleConfigSeverity.Error, 'never'],
        'type-enum': [
            RuleConfigSeverity.Error,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test',
            ],
        ],
        'duplicate-type-subject-start': [2, 'always'],
        'duplicate-commit-type': [2, 'always'],
        ...opts.rules,
    };
    core.debug(JSON.stringify(rules, null, 2));
    core.debug(JSON.stringify(lintOptions, null, 2));
    const report = await lint(input, rules, lintOptions);
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