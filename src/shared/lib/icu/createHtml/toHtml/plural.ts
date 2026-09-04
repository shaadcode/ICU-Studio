import type { PluralElement } from '@formatjs/icu-messageformat-parser';

import { indent } from '@/shared/lib/tiptap';
import { createMessageId } from '../../createMessageId';
import type { ExtendedValidPluralRule, SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<PluralElement>;

export const pluralToHtml = (params: Params) => {
  const { methods, message } = params;
  const options = message.options;
  const offset = message.offset as number;
  const id = createMessageId();

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  const { depth } = params.ctx;

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({ depth, referenceId: id, value: message.value });
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
    const optionId = createMessageId();

    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    methods.addPluralOption({
      value: typedOptionKey,
      referenceId: optionId,
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
        formattingChars: { prepend: indent(depth) },
      });
    }
  });
};
