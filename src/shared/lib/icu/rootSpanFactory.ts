import { MARK_TYPES } from './createHtml/createHtml';
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
  dependsOn?: CreateSpanElemParams['referenceId'];
  referenceId?: CreateSpanElemParams['referenceId'];

};

export const rootSpanMethods = (rootParams: RootSpanMethodsParams) => {
  const rootSpan = document.createElement('span');

  return {
    rootSpan,
    addTagValue: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.tagValue,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addComma: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.comma,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `,${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addPound: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.pound,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `#${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOffsetColon: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.offsetColon,
      value: `:${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addStem: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.stem,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addRawText: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      markType: MARK_TYPES.rawText,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOffsetKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.offsetKeyword,
      value: `offset${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addPluralKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.pluralKeyword,
      value: `plural${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSelectKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.selectKeyword,
      value: `select${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addRightAngleOpenTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.rightAngleOpenTag,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addStemOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      markType: MARK_TYPES.stemOption,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSkeletonSeparator: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.skeletonSeparator,
      value: `::${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addDateArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.dateArgumentName,
      value: `date${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addTimeArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.timeArgumentName,
      value: `time${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOptionDelimiterEnd: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.optionDelimiterEnd,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addRightAngleCloseTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.rightAngleCloseTag,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOffsetValue: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.offsetValue,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addLeftAngleOpenTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.leftAngleOpenTag,
      value: '<' + `${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addStemOptionSeparator: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `/${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.stemOptionSeparator,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addPluralOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.pluralOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSelectOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.selectOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.argumentName,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addOptionDelimiterStart: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.optionDelimiterStart,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addLeftAngleCloseTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.leftAngleCloseTag,
      value: '</' + `${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),

    addNumberArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.numberArgumentName,
      value: `number${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addArgumentNameDelimiterEnd: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.argumentNameDelimiterEnd,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addDedicatedFormatter: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.dedicatedFormatter,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addSelectOrdinalKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.selectOrdinalKeyword,
      value: `selectordinal${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addArgumentNameDelimiterStart: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.argumentNameDelimiterStart,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),
    addDateTimeSkeletonPattern: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.dateTimeSkeletonPattern,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    })),

  } as const;
};
