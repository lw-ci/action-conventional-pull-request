import {
  QualifiedRules,
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType,
  type FormattableReport,
  type LintOptions,
  type LintOutcome,
} from '@commitlint/types';
import load from '@commitlint/load';
import lint from '@commitlint/lint';
import format from '@commitlint/format';
import * as core from '@actions/core';
import type { CustomActionConfig } from './helpers.js';

function countOccurrences(inputString: string, targetSubstring: string) {
  if (!inputString || !targetSubstring) return 0;

  const regex = new RegExp(targetSubstring, 'g');
  const matches = inputString.match(regex);
  return matches ? matches.length : 0;
}

export async function lintTitle(
  { input }: { input: string },
  config: CustomActionConfig,
) {
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
      revertPattern:
        /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
      revertCorrespondence: ['header', 'hash'],
      issuePrefixes: ['#'],
    },
  };
  const parserOpts = {
    ...defaultParserOptions.parserOpts,
    ...((opts?.parserPreset?.parserOpts ?? {}) as object),
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
            const occurrences = countOccurrences(
              header?.toString() ?? '',
              `${type}:`,
            );

            return [occurrences < 2, 'Should not duplicate the commit type'];
          },
        },
      },
      ...customPlugins,
    },
    parserOpts,
  } as LintOptions;

  const rules = {
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'] as const,
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'] as const,
    'footer-max-line-length': [
      RuleConfigSeverity.Error,
      'always',
      100,
    ] as const,
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100] as const,
    'header-trim': [RuleConfigSeverity.Error, 'always'] as const,
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ] as [RuleConfigSeverity, RuleConfigCondition, TargetCaseType[]],
    'subject-empty': [RuleConfigSeverity.Error, 'never'] as const,
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'] as const,
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'] as const,
    'type-empty': [RuleConfigSeverity.Error, 'never'] as const,
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
  } satisfies QualifiedRules;

  core.debug(JSON.stringify(rules, null, 2));
  core.debug(JSON.stringify(lintOptions, null, 2));

  const report = await lint(input, rules, lintOptions);
  return report;
}

export async function convertLintOutcomesToReportResults(
  outcomes: Array<LintOutcome>,
) {
  return outcomes.map((outcome) => {
    return {
      errors: outcome.errors,
      warnings: outcome.warnings,
      input: outcome.input,
    };
  });
}

export async function formatReport(
  reportResults: FormattableReport['results'],
) {
  return format({
    results: reportResults,
  });
}
