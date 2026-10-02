import type { SelectElement } from '@formatjs/icu-messageformat-parser';

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
  methods.addArgumentName({
    depth,
    referenceId: id,
    value: message.value,
    variableType: 'date',
  });
  methods.addComma();
  methods.addSelectKeyword();

  methods.addComma({ formattingChars: { append: ['hardBreak'] } });

  const entriesOptions = Object.entries(options);

  entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    const optionId = createMessageId();

    methods.addSelectOption({
      depth,
      value: typedOptionKey,
    });

    if (optionValue?.value) {
      methods.addOptionDelimiterStart({ dependsOn: optionId });
      params.traverse(optionValue?.value, params.ctx);
      methods.addOptionDelimiterEnd({
        dependsOn: optionId,
        formattingChars: { append: ['hardBreak'] },
      });
    }

    if (optionIndex === entriesOptions.length - 1) {
      methods.addArgumentNameDelimiterEnd({
        depth,
        dependsOn: id,
      });
    }
  });
};
