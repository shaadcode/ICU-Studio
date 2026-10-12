import type { DateElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';
import { isRichDateTimeSkeleton, isSimpleDateTimeSkeleton } from '../../typeGuards';

type Params = SharedToHtmlHelpersParams<DateElement>;

export const dateToHtml = (params: Params) => {
  const { ctx, methods, message } = params;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  const treeNode = createTreeNodeData();
  const id = createMessageId();
  const varName = message.value.trim();
  treeNode.value = createTreeNodePath(ctx, 'date');
  treeNode.label = varName;
  treeNode.type = 'date';
  treeNode.location = message.location!;
  treeNode.referenceId = id;
  ctx.treeData.push(treeNode);
  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({
    value: varName,
    referenceId: id,
    variableType: 'date',
  });

  methods.addComma();
  methods.addDateArgumentName();

  if (isRichDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addSkeletonSeparator();
    methods.addDateTimeSkeletonPattern({ value: message.style.pattern });
  }
  if (isSimpleDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addDedicatedFormatter({ value: message.style });
  }
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
