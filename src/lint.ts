import type {
  FormattableReport,
  LintOptions,
  LintOutcome,
} from '@commitlint/types';
import load from '@commitlint/load';
import lint from '@commitlint/lint';
import format from '@commitlint/format';
import type { CustomActionConfig } from './helpers';

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
    parserOpts: opts.parserPreset ? opts.parserPreset.parserOpts : undefined,
  } as LintOptions;

  const report = await lint(
    input,
    {
      'duplicate-type-subject-start': [2, 'always'],
      'duplicate-commit-type': [2, 'always'],
      ...opts.rules,
    },
    lintOptions,
  );
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
