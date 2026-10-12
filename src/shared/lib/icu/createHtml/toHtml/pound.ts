import type { PoundElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';

type Params = SharedToHtmlHelpersParams<PoundElement>;

export const poundToHtml = (params: Params) => {
  const { ctx, methods } = params;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  const treeNode = createTreeNodeData();
  treeNode.value = createTreeNodePath(ctx, 'pound');
  treeNode.label = 'pound(#)';
  treeNode.type = 'pound';
  treeNode.location = params.message.location!;
  treeNode.referenceId = ctx.referenceId;
  ctx.treeData.push(treeNode);

  methods.addPound({ dependsOn: ctx.referenceId });
};
