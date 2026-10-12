import type { LiteralElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';

type Params = SharedToHtmlHelpersParams<LiteralElement>;

export const literalToHtml = (params: Params) => {
  const { ctx, methods, message } = params;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  const treeNode = createTreeNodeData();
  ctx.treeData.push(treeNode);
  treeNode.location = message.location!;

  if (message.value.includes('{') && message.value.includes('}')) {
    methods.addRawText({
      value: message
        .value
        .replace('{', '\'{\'')
        .replace('}', '\'}\''),
    });
  } else if (message.value.length) {
    treeNode.value = createTreeNodePath(ctx, 'literal');
    treeNode.label = message.value;
    treeNode.type = 'literal';

    methods.addRawText({ value: message.value });
  }
};
