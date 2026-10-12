import type { TimeElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';
import { isRichDateTimeSkeleton, isSimpleDateTimeSkeleton } from '../../typeGuards';

type Params = SharedToHtmlHelpersParams<TimeElement>;

export const timeToHtml = (params: Params) => {
  const { ctx, methods, message } = params;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  const id = createMessageId();
  const varName = message.value.trim();
  const treeNode = createTreeNodeData();
  treeNode.label = varName;
  treeNode.value = createTreeNodePath(ctx, 'time');
  treeNode.type = 'time';
  treeNode.location = message.location!;
  treeNode.referenceId = id;
  ctx.treeData.push(treeNode);
  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({
    value: varName,
    referenceId: id,
    variableType: 'time',
  });

  methods.addComma();
  methods.addTimeArgumentName();
  if (isSimpleDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addDedicatedFormatter({ value: message.style });
  }

  if (isRichDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addSkeletonSeparator();
    methods.addDateTimeSkeletonPattern({ value: message.style.pattern });
  }
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
