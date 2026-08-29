import type { TagElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<TagElement>;

export const xmlTagToHtml = (params: Params) => {
  const { methods, message } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addLeftAngleOpenTag();
  methods.addTagValue({ value: message.value });
  methods.addRightAngleOpenTag();
  params.traverse(message.children);
  methods.addLeftAngleCloseTag();
  methods.addTagValue({ value: message.value });
  methods.addRightAngleCloseTag();
};
