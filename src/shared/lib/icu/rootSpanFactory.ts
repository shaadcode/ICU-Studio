import { createSpanElement } from './createSpanElement';
import type { CreateSpanElemParams } from './createSpanElement';
import { NODE_CLASSES } from '@/pages/landing/ui/Editor/Controls/FormatMessage/createHtml';

type SharedParamsMethods = {
  depth?: number;
  /**
   * just for space and \n
   */
  appendValue?: string;
  value?: string | number;
  referenceId?: CreateSpanElemParams['referenceId'];
};

export const rootSpanMethods = () => {
  const rootSpan = document.createElement('span');
  return {
    rootSpan,
    addComma: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.comma,
      referenceId: params?.referenceId,
      value: `,${params?.appendValue ?? ''}`,
    })),
    addPound: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.pound,
      referenceId: params?.referenceId,
      value: `#${params?.appendValue ?? ''}`,
    })),
    addOffsetColon: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.offsetColon,
      value: `:${params?.appendValue ?? ''}`,
    })),
    addStem: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.stem,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addRawText: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.rawText,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addOffsetKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.offsetKeyword,
      value: `offset${params?.appendValue ?? ''}`,
    })),
    addPluralKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.pluralKeyword,
      value: `plural${params?.appendValue ?? ''}`,
    })),
    addSelectKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.selectKeyword,
      value: `select${params?.appendValue ?? ''}`,
    })),
    addTagValue: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.tagValue,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addRightAngleOpenTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.rightAngleOpenTag,
    })),
    addStemOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.stemOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addSkeletonSeparator: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `::${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.skeletonSeparator,
    })),
    addDateArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.dateArgumentName,
      value: `date${params?.appendValue ?? ''}`,
    })),
    addTimeArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.timeArgumentName,
      value: `time${params?.appendValue ?? ''}`,
    })),
    addOptionDelimiterEnd: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.optionDelimiterEnd,
    })),
    addRightAngleCloseTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.rightAngleCloseTag,
    })),
    addOffsetValue: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.offsetValue,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addLeftAngleOpenTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.leftAngleOpenTag,
      value: '<' + `${params?.appendValue ?? ''}`,
    })),
    addStemOptionSeparator: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `/${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.stemOptionSeparator,
    })),
    addPluralOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.pluralOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addSelectOption: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.selectOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.argumentName,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addOptionDelimiterStart: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.optionDelimiterStart,
    })),
    addLeftAngleCloseTag: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.leftAngleCloseTag,
      value: '</' + `${params?.appendValue ?? ''}`,
    })),

    addNumberArgumentName: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.numberArgumentName,
      value: `number${params?.appendValue ?? ''}`,
    })),
    addArgumentNameDelimiterEnd: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.argumentNameDelimiterEnd,
    })),
    addDedicatedFormatter: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.dedicatedFormatter,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
    addSelectOrdinalKeyword: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.selectOrdinalKeyword,
      value: `selectordinal${params?.appendValue ?? ''}`,
    })),
    addArgumentNameDelimiterStart: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      className: NODE_CLASSES.argumentNameDelimiterStart,
    })),
    addIndentByDepth: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      className: NODE_CLASSES.indent,
      referenceId: params?.referenceId,
      value: `${'    '.repeat(params?.depth ?? 1)}${params?.appendValue ?? ''}`,
    })),
    addDateTimeSkeletonPattern: (params?: SharedParamsMethods) => rootSpan.appendChild(createSpanElement({
      referenceId: params?.referenceId,
      className: NODE_CLASSES.dateTimeSkeletonPattern,
      value: `${params?.value}${params?.appendValue ?? ''}`,
    })),
  };
};
