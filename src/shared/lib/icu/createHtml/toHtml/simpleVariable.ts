import type { ArgumentElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<ArgumentElement>;

export const simpleVariableToHtml = (params: Params) => {
  const { methods, message } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addArgumentNameDelimiterStart();
  methods.addArgumentName({ value: message.value });

  methods.addArgumentNameDelimiterEnd();
};
