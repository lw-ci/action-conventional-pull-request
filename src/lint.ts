import type { LintOptions } from '@commitlint/types';
import load from '@commitlint/load';
import lint from '@commitlint/lint';

function countOccurrences(inputString: string, targetSubstring: string) {
  if (!inputString || !targetSubstring) return 0;

  const regex = new RegExp(targetSubstring, 'g');
  const matches = inputString.match(regex);
  return matches ? matches.length : 0;
}

export async function lintTitle({ input }: { input: string }) {
  const CONFIG = {
    extends: ['@commitlint/config-conventional']
  };
  const opts = await load(CONFIG);
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
          'duplicate-type-subject-start': props => {
            const { subject, type } = props;
            const [startingWord] = subject ? subject.split(' ') : [];

            return [
              startingWord?.trim() !== type,
              'Should not start subject with the commit type'
            ];
          },
          /**
           * This rule checks if the commit type is duplicated.
           *
           * Samples:
           * Invalid => fix: fix: fix something
           * Correct => fix: something
           */
          'duplicate-commit-type': props => {
            const { type, header } = props;
            const occurrences = countOccurrences(
              header?.toString() ?? '',
              `${type}:`
            );

            return [occurrences < 2, 'Should not duplicate the commit type'];
          }
        }
      }
    },
    parserOpts: opts.parserPreset ? opts.parserPreset.parserOpts : undefined
  } as LintOptions;

  const report = await lint(
    input,
    {
      ...opts.rules,
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [1, 'always'],
      'header-max-length': [2, 'always', 100],
      'subject-case': [
        2,
        'never',
        ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
      ],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],
      'type-case': [2, 'always', 'lower-case'],
      'type-empty': [2, 'never'],
      'scope-case': [2, 'always', 'lower-case'],
      'duplicate-type-subject-start': [2, 'always'],
      'duplicate-commit-type': [2, 'always']
    },
    lintOptions
  );
  return report;
}
