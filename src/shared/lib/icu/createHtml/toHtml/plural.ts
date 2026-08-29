import type { PluralElement } from '@formatjs/icu-messageformat-parser';

import { indent } from '@/shared/lib/tiptap';
import type { ExtendedValidPluralRule, SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<PluralElement>;

export const pluralToHtml = (params: Params) => {
  const { methods, message } = params;
  const options = message.options;
  const offset = message.offset as number;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  const { depth } = params.ctx;

  methods.addArgumentNameDelimiterStart();
  methods.addArgumentName({ value: message.value, referenceId: `depth-${depth}` });
  methods.addComma();
  if (message.pluralType === 'cardinal') {
    methods.addPluralKeyword();
  } else {
    methods.addSelectOrdinalKeyword();
  }

  if (offset > 0) {
    methods.addComma();
    methods.addOffsetKeyword();
    methods.addOffsetColon();
    methods.addOffsetValue({ value: offset, formattingChars: { append: '\n' } });
  } else {
    methods.addComma({ formattingChars: { append: '\n' } });
  }

  const entriesOptions = Object.entries(options);

  entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    methods.addPluralOption({
      value: typedOptionKey,
      formattingChars: { prepend: indent(depth) },
    });

    if (optionValue?.value) {
      methods.addOptionDelimiterStart();
      params.traverse(optionValue?.value, params.ctx);
      methods.addOptionDelimiterEnd({
        formattingChars: { append: '\n' },
      });
    }

    if (optionIndex === entriesOptions.length - 1) {
      methods.addArgumentNameDelimiterEnd({
        formattingChars: { prepend: indent(depth) } });
    }
  });
};
