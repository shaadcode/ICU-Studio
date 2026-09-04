import type { ArgumentElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<ArgumentElement>;

export const simpleVariableToHtml = (params: Params) => {
  const { ctx, methods, message } = params;
  const id = createMessageId();

  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({ referenceId: id, depth: ctx.depth, value: message.value });
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
