import type { TagElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<TagElement>;

export const xmlTagToHtml = (params: Params) => {
  const { methods, message } = params;
  const id = createMessageId();

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addLeftAngleOpenTag({ dependsOn: id });
  methods.addTagValue({ referenceId: id, value: message.value });
  methods.addRightAngleOpenTag();
  params.traverse(message.children);
  methods.addLeftAngleCloseTag();
  methods.addTagValue({ referenceId: id, value: message.value });
  methods.addRightAngleCloseTag({ dependsOn: id });
};
