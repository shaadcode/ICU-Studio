import type { TYPE, MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import { dateToHtml } from './toHtml/date';
import { timeToHtml } from './toHtml/time';
import { xmlTagToHtml } from './toHtml/tag';
import { poundToHtml } from './toHtml/pound';
import { pluralToHtml } from './toHtml/plural';
import { selectToHtml } from './toHtml/select';
import { numberToHtml } from './toHtml/number';
import { literalToHtml } from './toHtml/literal';
import type { SharedToHtmlHelpersParams } from './types';
import { simpleVariableToHtml } from './toHtml/simpleVariable';
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

export type TraverseContext = { id: string; depth: number };

export type DefaultToHtml = <ElementType extends MessageFormatElement>() => SharedToHtmlHelpersParams<ElementType>;

export type Traverse = (
  messages: Array<MessageFormatElement>,
  prevCtx?: TraverseContext,
) => MessageFormatElement[];

type Options = {
  withFormatting?: true;
};

export const extractInfoAndHtml = (parsedMessage: Array<MessageFormatElement>, opts?: Options) => {
  const { rootSpan, ...methods } = rootSpanMethods({
    withFormatting: opts?.withFormatting,
  });

  const traverse: Traverse = (messages, prevCtx) => messages.map((message, ctxIndex) => {
    const currentDepth = (prevCtx?.depth ?? 0) + 1;
    const ctxId = String(ctxIndex);

    const CurrentContext = {
      id: ctxId,
      depth: currentDepth,
    } as TraverseContext;

    const defaultToHtmlParams: DefaultToHtml = () => ({
      methods,
      traverse,
      rootSpan,
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

  traverse(parsedMessage);

  return rootSpan;
};
