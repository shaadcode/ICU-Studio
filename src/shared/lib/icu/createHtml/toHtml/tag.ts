import type { TagElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<TagElement>;

export const xmlTagToHtml = (params: Params) => {
  const { methods, message } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  const id = createMessageId();
  const varName = message.value.trim();
  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addLeftAngleOpenTag({ dependsOn: id });
  methods.addTagValue({ value: varName, referenceId: id });
  methods.addRightAngleOpenTag();
  params.traverse(message.children);
  methods.addLeftAngleCloseTag();
  methods.addTagValue({ value: varName, referenceId: id });
  methods.addRightAngleCloseTag({ dependsOn: id });
};
