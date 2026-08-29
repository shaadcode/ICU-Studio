import { NODE_CLASSES } from './createHtml/createHtml';
import { createSpanElement } from './createSpanElement';
import type { FormattingNode, CreateSpanElemParams } from './createSpanElement';

type RootSpanMethodsParams = {
  withFormatting?: true;

};

type SharedParamsMethods = {
  depth?: number;
  appendValue?: string;
  value?: string | number;
  formattingChars?: FormattingNode;
  referenceId?: CreateSpanElemParams['referenceId'];

};

export const rootSpanMethods = (rootParams: RootSpanMethodsParams) => {
  const rootSpan = document.createElement('span');

  return {
    rootSpan,
    addComma: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.comma,
      referenceId: params?.referenceId,
      value: `,${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addPound: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.pound,
      referenceId: params?.referenceId,
      value: `#${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOffsetColon: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.offsetColon,
      value: `:${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addStem: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.stem,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addRawText: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.rawText,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOffsetKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.offsetKeyword,
      value: `offset${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addPluralKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.pluralKeyword,
      value: `plural${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSelectKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.selectKeyword,
      value: `select${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addTagValue: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.tagValue,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addRightAngleOpenTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.rightAngleOpenTag,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addStemOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.stemOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSkeletonSeparator: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `::${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.skeletonSeparator,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addDateArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.dateArgumentName,
      value: `date${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addTimeArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.timeArgumentName,
      value: `time${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOptionDelimiterEnd: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.optionDelimiterEnd,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addRightAngleCloseTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.rightAngleCloseTag,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOffsetValue: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.offsetValue,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addLeftAngleOpenTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.leftAngleOpenTag,
      value: '<' + `${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addStemOptionSeparator: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `/${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.stemOptionSeparator,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addPluralOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.pluralOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSelectOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.selectOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.argumentName,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOptionDelimiterStart: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.optionDelimiterStart,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addLeftAngleCloseTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.leftAngleCloseTag,
      value: '</' + `${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),

    addNumberArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.numberArgumentName,
      value: `number${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addArgumentNameDelimiterEnd: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.argumentNameDelimiterEnd,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addDedicatedFormatter: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.dedicatedFormatter,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSelectOrdinalKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.selectOrdinalKeyword,
      value: `selectordinal${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addArgumentNameDelimiterStart: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.argumentNameDelimiterStart,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addDateTimeSkeletonPattern: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.dateTimeSkeletonPattern,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),

  } as const;
};
