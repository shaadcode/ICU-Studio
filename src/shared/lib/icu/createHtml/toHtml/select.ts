import type { SelectElement } from '@formatjs/icu-messageformat-parser';

import { indent } from '@/shared/lib/tiptap';
import { createMessageId } from '../../createMessageId';
import type { ExtendedValidPluralRule, SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<SelectElement>;

export const selectToHtml = (params: Params) => {
  const { methods, message } = params;
  const id = createMessageId();
  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  const { depth } = params.ctx;

  const options = message.options;
  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({ depth, referenceId: id, value: message.value });
  methods.addComma();
  methods.addSelectKeyword();

  methods.addComma({ formattingChars: { append: '\n' } });

  const entriesOptions = Object.entries(options);

  entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    const optionId = createMessageId();

    methods.addSelectOption({
      value: typedOptionKey,
      formattingChars: { prepend: indent(depth) },
    });

    if (optionValue?.value) {
      methods.addOptionDelimiterStart({ dependsOn: optionId });
      params.traverse(optionValue?.value, params.ctx);
      methods.addOptionDelimiterEnd({
        dependsOn: optionId,
        formattingChars: { append: '\n' },
      });
    }

    if (optionIndex === entriesOptions.length - 1) {
      methods.addArgumentNameDelimiterEnd({
        dependsOn: id,
        formattingChars: { prepend: indent(depth === 1 ? 0 : depth) },
      });
    }
  });
};
