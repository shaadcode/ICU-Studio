import type { PluralElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';
import type { ExtendedValidPluralRule, SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<PluralElement>;

export const pluralToHtml = (params: Params) => {
  const { ctx, methods, message } = params;
  const options = message.options;
  const offset = message.offset as number;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }

  const varName = message.value.trim();
  const id = createMessageId();
  ctx.referenceId = id;
  const pluralTreeNode = createTreeNodeData();
  pluralTreeNode.label = varName;
  pluralTreeNode.type = 'plural';
  pluralTreeNode.location = message.location!;
  pluralTreeNode.value = createTreeNodePath(ctx, 'plural');
  pluralTreeNode.referenceId = id;

  ctx.treeData.push(pluralTreeNode);

  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addArgumentNameDelimiterStart({
    dependsOn: id,
  });
  methods.addArgumentName({
    value: varName,
    referenceId: id,
    depth: ctx.depth,
    variableType: 'plural',
  });

  methods.addComma();
  if (message.pluralType === 'cardinal') {
    methods.addPluralKeyword();
  } else {
    methods.addSelectOrdinalKeyword();
  }

  if (offset > 0) {
    methods.addComma();
    methods.addOffsetKeyword();
    methods.addOffsetColon();
    methods.addOffsetValue({ value: offset, formattingChars: { append: ['hardBreak'] } });
  } else {
    methods.addComma({ formattingChars: { append: ['hardBreak'] } });
  }

  const entriesOptions = Object.entries(options);
  if (entriesOptions.length) {
    ctx.parentType = `${ctx.parentType}/plural`;
  }
  entriesOptions.forEach(([optionKey, optionValue], optionIndex) => {
    const optionId = createMessageId();
    const optionTreeNode = createTreeNodeData();
    optionTreeNode.label = optionKey;
    optionTreeNode.type = 'plural-option';
    optionTreeNode.location = optionValue.location!;
    optionTreeNode.referenceId = optionId;

    optionTreeNode.value = createTreeNodePath(
      { ...ctx, childIndex: optionIndex },
      'plural-option',
    );
    pluralTreeNode.children.push(optionTreeNode);

    const typedOptionKey = optionKey as ExtendedValidPluralRule;
    methods.addPluralOption({
      depth: ctx.depth,
      value: typedOptionKey,
      referenceId: optionId,
    });

    if (optionValue?.value) {
      methods.addOptionDelimiterStart({ dependsOn: optionId });
      params.traverse(
        optionValue?.value,
        {
          ...ctx,
          treeData: optionTreeNode.children,
          parentType: `${ctx.parentType}/${optionIndex}/plural-option`,
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
