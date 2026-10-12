import type { SelectElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';
import type { ExtendedValidPluralRule, SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<SelectElement>;

export const selectToHtml = (params: Params) => {
  const { ctx, methods, message } = params;
  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  const id = createMessageId();
  const varName = message.value.trim();
  ctx.referenceId = id;
  const selectTreeNode = createTreeNodeData();
  selectTreeNode.value = createTreeNodePath(ctx, 'select');
  selectTreeNode.label = varName;
  selectTreeNode.type = 'select';
  selectTreeNode.location = message.location!;
  selectTreeNode.referenceId = id;

  ctx.treeData.push(selectTreeNode);
  params.variableReferences.set(varName, { name: varName, referenceId: id });

  const options = message.options;
  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({
    value: varName,
    referenceId: id,
    depth: ctx.depth,
    variableType: 'select',
  });

  methods.addComma();
  methods.addSelectKeyword();

  methods.addComma({ formattingChars: { append: ['hardBreak'] } });

  const entriesOptions = Object.entries(options);

  if (entriesOptions.length) {
    ctx.parentType = `${ctx.parentType}/select`;
  }
  entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    const optionId = createMessageId();
    const optionTreeNode = createTreeNodeData();
    optionTreeNode.label = optionKey;
    optionTreeNode.type = 'select-option';
    optionTreeNode.location = optionValue.location!;
    optionTreeNode.referenceId = optionId;

    optionTreeNode.value = createTreeNodePath(
      { ...ctx, childIndex: optionIndex },
      'select-option',
    );
    selectTreeNode.children.push(optionTreeNode);

    methods.addSelectOption({
      depth: ctx.depth,
      value: typedOptionKey,
    });

    if (optionValue?.value) {
      methods.addOptionDelimiterStart({ dependsOn: optionId });
      params.traverse(
        optionValue?.value,
        {
          ...ctx,
          treeData: optionTreeNode.children,
          parentType: `${ctx.parentType}/${optionIndex}/select-option`,
        },
      );
      methods.addOptionDelimiterEnd({
        dependsOn: optionId,
        formattingChars: { append: ['hardBreak'] },
      });
    }

    if (optionIndex === entriesOptions.length - 1) {
      methods.addArgumentNameDelimiterEnd({
        dependsOn: id,
        depth: ctx.depth,
      });
    }
  });
};
