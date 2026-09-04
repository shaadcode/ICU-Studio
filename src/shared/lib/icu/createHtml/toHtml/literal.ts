import type { LiteralElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<LiteralElement>;

export const literalToHtml = (params: Params) => {
  const { methods, message } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  if (message.value.includes('{') && message.value.includes('}')) {
    methods.addRawText({
      value: message
        .value
        .replace('{', '\'{\'')
        .replace('}', '\'}\''),
    });
  } else {
    methods.addRawText({ value: message.value });
  }
};
