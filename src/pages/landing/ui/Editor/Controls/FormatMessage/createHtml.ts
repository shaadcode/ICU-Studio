import type { LiteralUnion } from 'type-fest';
import { TYPE } from '@formatjs/icu-messageformat-parser';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import { rootSpanMethods } from '@/shared/lib/icu/rootSpanFactory';
import { isRichNumberSkeleton, isRichDateTimeSkeleton, isSimpleNumberSkeleton, isSimpleDateTimeSkeleton } from '@/shared/lib/icu/typeGuards';

export const NODE_CLASSES = {
  stem: 'stem',
  pound: 'pound',
  comma: 'comma',
  indent: 'indent',
  rawText: 'raw-text',
  stemOption: 'stem-option',
  offsetValue: 'offset-value',
  offsetColon: 'offset-colon',
  argumentName: 'argument-name',
  pluralOption: `plural-option`,
  selectOption: `select-option`,
  offsetKeyword: 'offset-keyword',
  numberKeyword: 'number-keyword',
  pluralKeyword: 'plural-keyword',
  selectKeyword: 'select-keyword',
  pluralTypeOrd: 'plural-type ordinal',
  pluralTypeCard: 'plural-type cardinal',
  dateArgumentName: 'date-argument-name',
  timeArgumentName: 'time-argument-name',
  skeletonSeparator: 'skeleton-separator',
  dedicatedFormatter: 'dedicated-formatter',
  numberArgumentName: 'number-argument-name',
  optionDelimiterEnd: `option-delimiter end`,
  stemOptionSeparator: 'stem-option-separator',
  selectOrdinalKeyword: 'selectOrdinal-keyword',
  optionDelimiterStart: `option-delimiter start`,
  argumentNameDelimiterEnd: `argument-name-delimiter end`,
  argumentNameDelimiterStart: `argument-name-delimiter start`,
} as const;

export type SpanDataAttrs = 'class' | 'data-reference-id';

type ExtendedValidPluralRule = LiteralUnion<'one' | 'two' | 'few' | 'zero' | 'many' | 'other', string>;

export const createHtml = (parsedMessage: Array<MessageFormatElement>) => {
  const { rootSpan, ...methods } = rootSpanMethods();
  const traverse = (
    elems: Array<MessageFormatElement>,
    ctx?: { id?: string; prevDepth: number },
  ) => elems.map((item, ctxIndex) => {
    const currentDepth = (ctx?.prevDepth ?? 1);
    const ctxId = String(ctxIndex);
    if (item.type === TYPE.plural) {
      const options = item.options;
      const offset = item.offset as number;
      methods.addArgumentNameDelimiterStart();
      methods.addArgumentName({ value: item.value, referenceId: `depth-${currentDepth}` });
      methods.addComma();
      if (item.pluralType === 'cardinal') {
        methods.addPluralKeyword();
      } else {
        methods.addSelectOrdinalKeyword();
      }

      if (offset > 0) {
        methods.addComma();
        methods.addOffsetKeyword();
        methods.addOffsetColon();
        methods.addOffsetValue({ value: offset, appendValue: '\n' });
      } else {
        methods.addComma({ appendValue: '\n' });
      }

      const entriesOptions = Object.entries(options);

      entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
        const typedOptionKey = optionKey as ExtendedValidPluralRule;
        methods.addIndentByDepth({ depth: currentDepth });
        methods.addPluralOption({ value: typedOptionKey });

        if (optionValue?.value) {
          methods.addOptionDelimiterStart();
          traverse(optionValue?.value, { id: ctxId, prevDepth: currentDepth });
          methods.addOptionDelimiterEnd({ appendValue: '\n' });
        }

        if (optionIndex === entriesOptions.length - 1) {
          methods.addArgumentNameDelimiterEnd();
        }
      });
    }

    if (item.type === TYPE.argument) {
      methods.addArgumentNameDelimiterStart();
      methods.addArgumentName({ value: item.value });
      methods.addArgumentNameDelimiterEnd();
    }

    if (item.type === TYPE.literal) {
      methods.addRawText({ value: item.value });
    }

    if (item.type === TYPE.pound) {
      methods.addPound({ referenceId: `depth-${currentDepth}` });
    }

    if (item.type === TYPE.select) {
      const options = item.options;
      methods.addArgumentNameDelimiterStart();
      methods.addArgumentName({ value: item.value, referenceId: `depth-${currentDepth}` });
      methods.addComma();
      methods.addSelectKeyword();

      methods.addComma({ appendValue: '\n' });

      const entriesOptions = Object.entries(options);

      entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
        const typedOptionKey = optionKey as ExtendedValidPluralRule;
        methods.addIndentByDepth({ depth: currentDepth });
        methods.addSelectOption({ value: typedOptionKey });

        if (optionValue?.value) {
          methods.addOptionDelimiterStart();
          traverse(optionValue?.value, { id: ctxId, prevDepth: currentDepth });
          methods.addOptionDelimiterEnd({ appendValue: '\n' });
        }

        if (optionIndex === entriesOptions.length - 1) {
          methods.addArgumentNameDelimiterEnd();
        }
      });
    }

    if (item.type === TYPE.number) {
      methods.addArgumentNameDelimiterStart();
      methods.addArgumentName({ value: item.value });
      methods.addComma();
      methods.addNumberArgumentName();

      if (isRichNumberSkeleton(item.style)) {
        methods.addComma();
        methods.addSkeletonSeparator();
        item.style.tokens.forEach((token) => {
          methods.addStem({ value: token.stem });
          if (token.options.length) {
            token.options.forEach((stemOption) => {
              methods.addStemOptionSeparator();
              methods.addStemOption({ value: stemOption });
            });
          }
        });
      }
      if (isSimpleNumberSkeleton(item.style)) {
        methods.addComma();
        methods.addDedicatedFormatter({ value: item.style });
      }
      methods.addArgumentNameDelimiterEnd();
    }

    if (item.type === TYPE.date) {
      methods.addArgumentNameDelimiterStart();
      methods.addArgumentName({ value: item.value });
      methods.addComma();
      methods.addDateArgumentName();
      if (isRichDateTimeSkeleton(item.style)) {
        methods.addComma();
        methods.addSkeletonSeparator();
        // item.style.tokens.forEach((token) => {
        //   methods.addStem({ value: token.stem });
        //   if (token.options.length) {
        //     token.options.forEach((stemOption) => {
        //       methods.addStemOptionSeparator();
        //       methods.addStemOption({ value: stemOption });
        //     });
        //   }
        // });
      }
      if (isSimpleDateTimeSkeleton(item.style)) {
        methods.addComma();
        methods.addDedicatedFormatter({ value: item.style });
      }
      methods.addArgumentNameDelimiterEnd();
    }

    if (item.type === TYPE.time) {
      methods.addArgumentNameDelimiterStart();
      methods.addArgumentName({ value: item.value });
      methods.addComma();
      methods.addTimeArgumentName();
      if (isSimpleDateTimeSkeleton(item.style)) {
        methods.addComma();
        methods.addDedicatedFormatter({ value: item.style });
      }
      methods.addArgumentNameDelimiterEnd();
    }

    return item;
  });

  traverse(parsedMessage);

  return rootSpan;
};
