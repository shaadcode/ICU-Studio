/* eslint-disable perfectionist/sort-objects */
import { forEachRight } from 'es-toolkit';
import type { Editor } from '@tiptap/react';
import { closest } from 'fastest-levenshtein';
import type { useTranslations } from 'use-intl';

import type { ErrorKindName } from '@/shared/lib/icu/types';
// fixers/index.ts
import type { ICUValidationSlice } from '@/pages/landing/config/store/editor/validationSlice';

export type FixerMap = Record<ErrorKindName, Fixer[]>;
export type FixContext = {
  editor: Editor;
  rawMessage: string;
  errorLocation: NonNullable<ICUValidationSlice['errorLocation']>;
  validationError: NonNullable<ICUValidationSlice['validationError']>;
};

export type Fixer = {
  id: string;
  condition?: (ctx: FixContext) => boolean;
  apply: (ctx: FixContext) => (void | false) | Promise<void | false>;
  labelKey: Parameters<ReturnType<typeof useTranslations<'editor'>>>[0];
};

const VALID_ARGUMENT_TYPES = [
  'number',
  'date',
  'time',
  // 'plural',
  // 'select',
  // 'selectordinal',
] as const;

// @ts-expect-error
export const fixers: FixerMap = {
  EXPECT_ARGUMENT_CLOSING_BRACE: [
    {
      id: 'append-closing-brace',
      labelKey: 'validation.fixes.missingBrace.appendBrace',
      apply: ({ editor, errorLocation }) => {
        const comma = editor.state.doc.textBetween(errorLocation.end, errorLocation.end + 1);

        if (comma) {
          editor
            .chain()
            .focus()
            .setMeta('is-message-fixer', true)
            .insertContentAt(
              {
                from: errorLocation.end,
                to: errorLocation.end + 1,
              },
              '',
            )
            .run();
          return;
        }
        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            errorLocation.end + 1,
            '}',
          )
          .run();
      },
    },
  ],
  MALFORMED_ARGUMENT: [
    {
      id: 'sanitize-argument-name',
      labelKey: 'validation.fixes.malformedArgument.sanitizeName',
      apply: ({ editor, errorLocation }) => {
        const { end, start } = errorLocation;
        const message = editor
          .state
          .doc
          .textBetween(start, end);
        const result = message
          .replace(/[^\p{L}\p{N}_]/gu, '');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            {
              from: start + 1,
              to: message.includes(' ') ? end : end + 1,
            },
            result,
          )
          .run();
      },
    },

  ],
  MISSING_OTHER_CLAUSE: [
    {
      id: 'add-empty-other',
      labelKey: 'validation.fixes.missingOther.addEmpty',
      apply: ({ editor, errorLocation }) => {
        editor
          .chain()
          .setMeta('is-message-fixer', true)
          .insertContentAt(errorLocation.end, 'other {}')
          .run();
      },
    },
    {
      id: 'add-other-with-hash',
      labelKey: 'validation.fixes.missingOther.addWithHash',
      apply: ({ editor, errorLocation }) => {
        editor
          .chain()
          .setMeta('is-message-fixer', true)
          .insertContentAt(errorLocation.end, 'other {#}')
          .run();
      },
    },
  ],
  EMPTY_ARGUMENT: [
    {
      id: 'remove-empty-argument',
      labelKey: 'validation.fixes.emptyArgument.remove',
      apply: ({ editor, errorLocation }) => {
        const { end, start } = errorLocation;

        const result = editor.state.doc.textBetween(start, end).replace(/\{\s*\}/g, '');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ to: end, from: start }, result)
          .run();
      },
    },
    {
      id: 'replace-with-default-variable',
      labelKey: 'validation.fixes.emptyArgument.replaceWithVariable',
      apply: ({ editor, errorLocation }) => {
        const { end, start } = errorLocation;

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ to: end, from: start }, '{variable}')
          .run();
      },
    },
  ],
  EXPECT_ARGUMENT_TYPE: [
    {
      id: 'remove-comma-and-close',
      labelKey: 'validation.fixes.expectArgumentType.removeComma',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start, end } = errorLocation.lineRangeOffset;
        const lineText = editor.state.doc.textBetween(start, end);

        const cleanedLineText = dropRightUntilPattern(
          lineText.split(''),
          validationError.location.end.column - 1,
          [','],
        ).join('');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            { from: start, to: end },
            cleanedLineText,
          )
          .run();
      },
    },
    {
      id: 'add-default-number-type',
      labelKey: 'validation.fixes.expectArgumentType.addNumberType',
      apply: ({ editor, errorLocation }) => {
        const { start, end } = errorLocation;

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            { from: start, to: end },
            'number',
          )
          .run();
      },
    },
    {
      id: 'add-default-date-type',
      labelKey: 'validation.fixes.expectArgumentType.addDateType',
      apply: ({ editor, errorLocation }) => {
        const { start, end } = errorLocation;

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ from: start, to: end }, 'date')
          .run();
      },
    },
    {
      id: 'add-default-time-type',
      labelKey: 'validation.fixes.expectArgumentType.addTimeType',
      apply: ({ editor, errorLocation }) => {
        const { start, end } = errorLocation;

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ from: start, to: end }, 'time')
          .run();
      },
    },
  ],
  INVALID_ARGUMENT_TYPE: [
    {
      id: 'replace-with-closest',
      labelKey: 'validation.fixes.invalidArgumentType.replaceWithClosest',
      apply: ({ editor, errorLocation }) => {
        const { start, end } = errorLocation;
        const invalidType = editor.state.doc.textBetween(start, end);

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            { from: start, to: end },
            closest(invalidType, VALID_ARGUMENT_TYPES),
          )
          .run();
      },
    },
    {
      id: 'remove-type',
      labelKey: 'validation.fixes.invalidArgumentType.removeType',
      apply: ({ editor, errorLocation, validationError }) => {
        const lineText = editor.state.doc.textBetween(
          errorLocation.lineRangeOffset.start,
          errorLocation.lineRangeOffset.end,
        );

        const cleanedLineText = dropRightUntilPattern(
          lineText.split(''),
          validationError.location.end.column - 1,
          [','],
        ).join('');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({
            from: errorLocation.lineRangeOffset.start,
            to: errorLocation.lineRangeOffset.end,
          }, cleanedLineText)
          .run();
      },
    },
  ],
  EXPECT_ARGUMENT_STYLE: [
    {
      id: 'remove-trailing-comma',
      labelKey: 'validation.fixes.expectArgumentStyle.removeTrailingComma',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start, end } = errorLocation.lineRangeOffset;
        const lineText = editor.state.doc.textBetween(start, end);
        const chars = lineText.split('');

        const cleanedText = dropRightUntilPattern(
          chars,
          validationError.location.end.column - 1,
          [','],
        ).join('');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ from: start, to: end }, cleanedText)
          .run();
      },
    },
    {
      id: 'add-default-number-style',
      labelKey: 'validation.fixes.expectArgumentStyle.addNumberStyle',
      apply: ({ editor, errorLocation }) => {
        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(errorLocation.start, 'decimal')
          .run();
      },
    },
    {
      id: 'remove-type-and-comma',
      labelKey: 'validation.fixes.expectArgumentStyle.removeTypeAndComma',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start, end } = errorLocation.lineRangeOffset;
        const lineText = editor.state.doc.textBetween(start, end);
        const chars = lineText.split('');

        const cleanedText = dropRightUntilPattern(
          chars,
          validationError.location.end.column - 1,
          [',', ','],
        ).join('');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ from: start, to: end }, cleanedText)
          .run();
      },
    },
  ],
  INVALID_NUMBER_SKELETON: [
    {
      id: 'remove-skeleton',
      labelKey: 'validation.fixes.invalidNumberSkeleton.removeSkeleton',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start, end } = errorLocation.lineRangeOffset;
        const lineText = editor.state.doc.textBetween(start, end);

        const cleanedLineText = dropRightUntilPattern(
          lineText.split(''),
          validationError.location.end.column - 1,
          [','],
        ).join('');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ from: start, to: end }, cleanedLineText)
          .run();
      },
    },

  ],
  EXPECT_DATE_TIME_SKELETON: [
    {
      id: 'remove-skeleton',
      labelKey: 'validation.fixes.expectDateTimeSkeleton.removeSkeleton',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start, end } = errorLocation.lineRangeOffset;
        const lineText = editor.state.doc.textBetween(start, end);

        const cleanedLineText = dropRightUntilPattern(
          lineText.split(''),
          validationError.location.end.column - 2,
          [','],
        ).join('');

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt({ from: start, to: end }, cleanedLineText)
          .run();
      },
    },
  ],
  UNCLOSED_QUOTE_IN_ARGUMENT_STYLE: [
    {
      id: 'close-quote',
      labelKey: 'validation.fixes.unclosedQuote.removeQuote',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start } = errorLocation.lineRangeOffset;

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            {
              from: start + validationError.location.start.column - 2,
              to: start + validationError.location.start.column - 1,
            },
            '',
          )
          .run();
      },
    },
    {
      id: 'close-quote',
      labelKey: 'validation.fixes.unclosedQuote.escapeQuote',
      apply: ({ editor, errorLocation, validationError }) => {
        const { start } = errorLocation.lineRangeOffset;

        editor
          .chain()
          .focus()
          .setMeta('is-message-fixer', true)
          .insertContentAt(
            start + validationError.location.start.column - 1,
            '\'',
          )
          .run();
      },
    },

  ],
};

/**
 * Walks an array of characters from right to left and drops everything
 * up to and including the first match of `pattern` (matched right-to-left),
 * but only while the index is within `columnLimit`.
 *
 * Once the pattern is fully matched (or `columnLimit` is exceeded),
 * the remaining characters to the left are kept untouched.
 *
 * @param chars        - The characters of the line to trim (left-to-right order).
 * @param columnLimit  - 1-based column limit (usually the error column).
 *                       Characters at index `i` are only considered while `i + 1 <= columnLimit`.
 * @param pattern      - Characters to match from right to left.
 *                       Example: `[',']` drops the last comma;
 *                       `[' ', ',']` drops the last comma preceded by a space.
 * @returns A new array of characters with the matched suffix removed.
 *
 * @example
 * dropRightUntilPattern(['{', 'a', ',', 'b', ',', ' ', '}'], 7, [','])
 * // => ['{', 'a', ',', 'b', ' ', '}']  // last comma removed
 *
 * @example
 * dropRightUntilPattern(['{', 'a', ',', 'b', ',', ' ', '}'], 7, [' ', ','])
 * // => ['{', 'a', ',', 'b', '}']        // ", " removed
 */
function dropRightUntilPattern(
  chars: string[],
  columnLimit: number,
  pattern: Array<string>,
): string[] {
  let keptChars: string[] = [];
  let snapCharsIndex = 0;

  forEachRight(chars, (char, i) => {
    if (snapCharsIndex < pattern.length && i + 1 <= columnLimit) {
      if (char === pattern[snapCharsIndex]) {
        snapCharsIndex = snapCharsIndex + 1;
      };
    } else {
      keptChars = [char, ...keptChars];
    }
  });

  return keptChars;
}
