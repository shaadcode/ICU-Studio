import type { NumberElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { createTreeNodeData, createTreeNodePath } from '@/shared/lib/mantine';
import { isRichNumberSkeleton, isSimpleNumberSkeleton } from '../../typeGuards';

type Params = SharedToHtmlHelpersParams<NumberElement>;

export const numberToHtml = (params: Params) => {
  const { ctx, methods, message } = params;

  if (!ctx) {
    throw new Error('ctx is undefined');
  }
  const id = createMessageId();
  const varName = message.value.trim();
  const treeNode = createTreeNodeData();
  treeNode.location = message.location!;
  treeNode.value = createTreeNodePath(ctx, 'number');
  treeNode.type = 'number';
  treeNode.label = varName;
  treeNode.referenceId = id;

  ctx.treeData.push(treeNode);

  params.variableReferences.set(varName, { name: varName, referenceId: id });

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({
    value: varName,
    referenceId: id,
    variableType: 'number',
  });

  methods.addComma();
  methods.addNumberArgumentName();

  if (isRichNumberSkeleton(message.style)) {
    methods.addComma();
    methods.addSkeletonSeparator();

    const tokens = message.style.tokens;
    tokens.forEach((token, tokenIndex) => {
      const tokenOptions = token.options;
      // add space
      if (tokenIndex < tokens.length - 1 && !tokenOptions.length) {
        methods.addStem({ value: `${token.stem} ` });
      } else {
        methods.addStem({ value: token.stem });
      }

      if (token.options.length) {
        token.options.forEach((stemOption) => {
          methods.addStemOptionSeparator();
          methods.addStemOption({ value: stemOption });
        });
      }
    });
  }

  if (isSimpleNumberSkeleton(message.style)) {
    methods.addComma();
    methods.addDedicatedFormatter({ value: message.style });
  }
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
