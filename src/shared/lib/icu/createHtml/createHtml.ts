import { words } from 'es-toolkit';
import type { LiteralUnion } from 'type-fest';
import type { TreeNodeData } from '@mantine/core';
import type { TYPE, MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import { dateToHtml } from './toHtml/date';
import { timeToHtml } from './toHtml/time';
import { xmlTagToHtml } from './toHtml/tag';
import { poundToHtml } from './toHtml/pound';
import { pluralToHtml } from './toHtml/plural';
import { selectToHtml } from './toHtml/select';
import { numberToHtml } from './toHtml/number';
import { literalToHtml } from './toHtml/literal';
import type { createTreeNodeData } from '../../mantine';
import type { SharedToHtmlHelpersParams } from './types';
import { simpleVariableToHtml } from './toHtml/simpleVariable';
import type { MessageOutlineData } from '../../mantine/constant';
import { rootSpanMethods } from '@/shared/lib/icu/rootSpanFactory';

export const MARK_TYPES = {
  stem: 'stem',
  pound: 'pound',
  comma: 'comma',
  rawText: 'raw-text',
  tagValue: 'tag-value',
  stemOption: 'stem-option',
  offsetValue: 'offset-value',
  offsetColon: 'offset-colon',
  argumentName: 'argument-name',
  pluralOption: `plural-option`,
  selectOption: `select-option`,
  offsetKeyword: 'offset-keyword',
  pluralKeyword: 'plural-keyword',
  selectKeyword: 'select-keyword',
  dateArgumentName: 'date-argument-name',
  timeArgumentName: 'time-argument-name',
  skeletonSeparator: 'skeleton-separator',
  leftAngleOpenTag: 'left-angle-open-tag',
  dedicatedFormatter: 'dedicated-formatter',
  rightAngleOpenTag: 'right-angle-open-tag',
  leftAngleCloseTag: 'left-angle-close-tag',
  numberArgumentName: 'number-argument-name',
  optionDelimiterEnd: `option-delimiter-end`,
  rightAngleCloseTag: 'right-angle-close-tag',
  stemOptionSeparator: 'stem-option-separator',
  selectOrdinalKeyword: 'selectOrdinal-keyword',
  optionDelimiterStart: `option-delimiter-start`,
  dateTimeSkeletonPattern: 'date-time-skeleton-pattern',
  argumentNameDelimiterEnd: `argument-name-delimiter-end`,
  argumentNameDelimiterStart: `argument-name-delimiter-start`,
} as const;

export type VariableReference = { name: string; referenceId: string };

export type DefaultToHtml = <ElementType extends MessageFormatElement>() => SharedToHtmlHelpersParams<ElementType>;

export type Traverse = (
  messages: Array<MessageFormatElement>,
  prevCtx?: TraverseContext,
) => MessageFormatElement[];

export type TraverseContext = {
  depth: number;
  childIndex: number;
  /**
   * reference id
   */
  referenceId: string;
  treeData: Array<TreeNodeData>;
  parentType: LiteralUnion<string, ReturnType<typeof createTreeNodeData>['type']>;
};

type Options = {
  withFormatting?: true;
};

type Params = {
  opts?: Options;
  rawMessage: string;
  parsedMessage: Array<MessageFormatElement>;
};

export const extractInfoAndHtml = (params: Params) => {
  const { stats, rootSpan, ...methods } = rootSpanMethods({
    withFormatting: params.opts?.withFormatting,
  });
  const treeData: Array<MessageOutlineData> = [];
  const variableReferences = new Map<string, VariableReference>();

  const traverse: Traverse = (messages, prevCtx) => messages.map((message, index) => {
    const currentDepth = (prevCtx?.depth ?? 0) + 1;

    const CurrentContext = {
      childIndex: index,
      depth: currentDepth,
      treeData: prevCtx?.treeData,
      referenceId: prevCtx?.referenceId,
      parentType: prevCtx?.parentType ?? 'root',
    } as TraverseContext;

    const defaultToHtmlParams: DefaultToHtml = () => ({
      methods,
      traverse,
      rootSpan,
      variableReferences,
      ctx: CurrentContext,
      // @ts-expect-error
      message: message as MessageFormatElement,
    });

    const htmlFactory = {
      3: () => dateToHtml(defaultToHtmlParams()),
      4: () => timeToHtml(defaultToHtmlParams()),
      7: () => poundToHtml(defaultToHtmlParams()),
      6: () => pluralToHtml(defaultToHtmlParams()),
      5: () => selectToHtml(defaultToHtmlParams()),
      2: () => numberToHtml(defaultToHtmlParams()),
      8: () => xmlTagToHtml(defaultToHtmlParams()),
      0: () => literalToHtml(defaultToHtmlParams()),
      1: () => simpleVariableToHtml(defaultToHtmlParams()),
    } as const satisfies Record<TYPE, () => void>;

    htmlFactory[message.type]();

    return message;
  });

  traverse(
    params.parsedMessage,
    {
      depth: 0,
      treeData,
      childIndex: 0,
      referenceId: '',
      parentType: 'root',
    },
  );

  stats.characters = params.rawMessage.length;
  stats.words = words(params.rawMessage).length;

  const totalChars = stats.literalCharacters + stats.icuSyntaxChars;
  if (totalChars > 0) {
    stats.textRatio = Math.round((stats.literalCharacters / totalChars) * 100);
    stats.icuSyntaxRatio = Math.round((stats.icuSyntaxChars / totalChars) * 100);
  }

  return {
    stats,
    rootSpan,
    treeData,
    variableReferences,
  };
};
