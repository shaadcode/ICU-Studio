/* eslint-disable perfectionist/sort-objects */
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
  'plural',
  'select',
  'selectordinal',
] as const;

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
            .insertContentAt(
              {
                from: errorLocation.end,
                to: errorLocation.end + 1,
              },
              '',
              { updateSelection: true },
            )
            .run();
          return;
        }
        editor
          .chain()
          .focus()
          .insertContentAt(
            errorLocation.end + 1,
            '}',
            { updateSelection: true },
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
          .insertContentAt(
            {
              from: start + 1,
              to: message.includes(' ') ? end : end + 1,
            },
            result,
            { updateSelection: true },
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
        if (!errorLocation.lineRangeOffset) {
          return false;
        }
        const { end, start } = errorLocation.lineRangeOffset;

        editor.state.doc.nodesBetween(start, end, (node, pos) => {
          if (node.marks?.[0]?.['attrs']?.['data-mark-type'] === 'plural-option') {
            editor
              .chain()
              .focus()
              .insertContentAt(
                { from: pos, to: pos + node.nodeSize },
                'other',
                { updateSelection: true },
              )
              .run();
          }
        });
      },
    },
    {
      id: 'add-other-with-hash',
      labelKey: 'validation.fixes.missingOther.addWithHash',
      apply: ({ editor, errorLocation }) => {
        if (errorLocation.lineRangeOffset) {
          const { end, start } = errorLocation.lineRangeOffset;

          editor
            .chain()
            .insertContentAt({ to: end, from: start }, 'other {#}', { updateSelection: true })
            .run();
        }
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
          .insertContentAt({ to: end, from: start }, result, { updateSelection: true })
          .run();
      },
    },
    {
      id: 'replace-with-default-variable',
      labelKey: 'validation.fixes.emptyArgument.replaceWithVariable',
      apply: ({ editor, errorLocation }) => {
        if (!errorLocation.lineRangeOffset) {
          return;
        }
        const { end, start } = errorLocation.lineRangeOffset;

        const result = editor.state.doc.textBetween(start, end).replace(/\{\s*\}/g, '{variable}');

        editor
          .chain()
          .focus()
          .insertContentAt({ to: end, from: start }, result)
          .run();
      },
    },
    {
      id: 'replace-with-default-variable',
      labelKey: 'validation.fixes.emptyArgument.fillWithHash',
      apply: ({ editor, errorLocation }) => {
        if (!errorLocation.lineRangeOffset) {
          return;
        }
        const { end, start } = errorLocation.lineRangeOffset;

        const result = editor.state.doc.textBetween(start, end).replace(/\{\s*\}/g, '#');

        editor
          .chain()
          .focus()
          .insertContentAt({ to: end, from: start }, result)
          .run();
      },
    },
  ],
  EXPECT_ARGUMENT_TYPE: [
    {
      id: 'remove-comma-and-close',
      labelKey: 'validation.fixes.expectArgumentType.removeComma',
      apply: ({ editor, errorLocation }) => {
        const { start, end } = errorLocation;

        const result = editor.state.doc.textBetween(start, end);

        if (!result) {
          const lineTextWithoutComma = editor
            .state
            .doc
            .textBetween(
              errorLocation.lineRangeOffset.start,
              errorLocation.lineRangeOffset.end,
            )
            .replace(',', '');

          editor
            .chain()
            .focus()
            .insertContentAt(
              {
                from: errorLocation.lineRangeOffset.start,
                to: errorLocation.lineRangeOffset.end,
              },
              lineTextWithoutComma,
              { updateSelection: true },
            )
            .run();

          return;
        }

        editor
          .chain()
          .focus()
          .insertContentAt(
            { from: start - 1, to: end },
            result,
            { updateSelection: true },
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
          .insertContentAt({ from: start, to: end }, 'number', { updateSelection: true })
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
          .insertContentAt({ from: start, to: end }, 'date', { updateSelection: true })
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
          .insertContentAt({ from: start, to: end }, 'time', { updateSelection: true })
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
      apply: ({ editor, errorLocation }) => {
        const lineText = editor.state.doc.textBetween(
          errorLocation.lineRangeOffset.start,
          errorLocation.lineRangeOffset.end,
        );

        const result = lineText.split(',')[0];
        editor
          .chain()
          .focus()
          .insertContentAt({
            from: errorLocation.lineRangeOffset.start - 1,
            to: errorLocation.lineRangeOffset.end,
          }, `${result}}`)
          .run();
      },
    },
  ],
};
