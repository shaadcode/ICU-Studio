import { randomId } from '@mantine/hooks';
import type { ArgumentElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<ArgumentElement>;

export const simpleVariableToHtml = (params: Params) => {
  const { methods, message } = params;
  const id = randomId('ICU-');

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({ referenceId: id, value: message.value });
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
