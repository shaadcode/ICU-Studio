import type { TagElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';

type Params = SharedToHtmlHelpersParams<TagElement>;

export const xmlTagToHtml = (params: Params) => {
  const { ctx, methods, message } = params;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }

  const id = createMessageId();
  const varName = message.value.trim();
  const treeNode = createTreeNodeData();
  treeNode.label = varName;
  treeNode.type = 'tag';
  treeNode.location = message.location!;
  treeNode.value = createTreeNodePath(ctx, 'tag');
  treeNode.referenceId = id;
  ctx.treeData.push(treeNode);
  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addLeftAngleOpenTag({ dependsOn: id });
  methods.addTagValue({ value: varName, referenceId: id });
  methods.addRightAngleOpenTag();
  params.traverse(message.children, { ...ctx, treeData: treeNode.children });
  methods.addLeftAngleCloseTag();
  methods.addTagValue({ value: varName, referenceId: id });
  methods.addRightAngleCloseTag({ dependsOn: id });
};
