import type { ArgumentElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';

type Params = SharedToHtmlHelpersParams<ArgumentElement>;

export const simpleVariableToHtml = (params: Params) => {
  const { ctx, methods, message } = params;
  if (!ctx) {
    throw new Error('ctx is undefined');
  }

  if (!params.message.value.length) {
    return;
  }
  const id = createMessageId();
  const varName = message.value.trim();
  const treeNode = createTreeNodeData();
  treeNode.label = varName;
  treeNode.value = createTreeNodePath(ctx, 'argument');
  treeNode.type = 'argument';
  treeNode.location = message.location!;
  treeNode.referenceId = id;

  ctx.treeData.push(treeNode);
  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addArgumentNameDelimiterStart({ dependsOn: id });

  methods.addArgumentName({
    value: varName,
    referenceId: id,
    depth: ctx.depth,
    variableType: 'argument',
  });
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
