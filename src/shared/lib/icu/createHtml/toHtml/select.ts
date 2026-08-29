import type { SelectElement } from '@formatjs/icu-messageformat-parser';

import { indent } from '@/shared/lib/tiptap';
import type { ExtendedValidPluralRule, SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<SelectElement>;

export const selectToHtml = (params: Params) => {
  const { methods, message } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  const { depth } = params.ctx;

  const options = message.options;
  methods.addArgumentNameDelimiterStart();
  methods.addArgumentName({ value: message.value, referenceId: `depth-${depth}` });
  methods.addComma();
  methods.addSelectKeyword();

  methods.addComma({ formattingChars: { append: '\n' } });

  const entriesOptions = Object.entries(options);

  entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    methods.addSelectOption({
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
        formattingChars: { prepend: indent(depth === 1 ? 0 : depth) },
      });
    }
  });
};
