import { words } from 'es-toolkit';

import { MARK_TYPES } from './createHtml/createHtml';
import { createEmptyStats } from './createHtml/stats';
import { createSpanElement } from './createSpanElement';
import type { MessageElementsTypeKeyword } from './types';
import type { FormattingPosition, CreateSpanElemParams } from './createSpanElement';

type RootSpanMethodsParams = {
  withFormatting?: true;
};

type ArgumentNameParams = SharedParamsMethods & {
  variableType: MessageElementsTypeKeyword;
};

type SharedParamsMethods = {
  depth?: number;
  appendValue?: string;
  value?: string | number;
  formattingChars?: FormattingPosition;
  dependsOn?: CreateSpanElemParams['referenceId'];
  referenceId?: CreateSpanElemParams['referenceId'];
};

export const rootSpanMethods = (rootParams: RootSpanMethodsParams) => {
  const rootSpan = document.createElement('span');
  const stats = createEmptyStats();

  function addTagValue(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.tagValue,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
  }

  function addComma(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.comma,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `,${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addPound(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.pound,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `#${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addOffsetColon(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.offsetColon,
      value: `:${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addStem(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      markType: MARK_TYPES.stem,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
  }

  function addRawText(params?: SharedParamsMethods) {
    const text = `${params?.value ?? ''}${params?.appendValue ?? ''}`;

    rootSpan.appendChild(createSpanElement({
      value: text,
      dependsOn: params?.dependsOn,
      markType: MARK_TYPES.rawText,
      referenceId: params?.referenceId,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));

    if (!text) {
      return;
    }

    stats.literalCharacters += text.length;
    stats.literalWords += words(text).length;

    const numberMatches = text.match(/[\d\u06F0-\u06F9\u0660-\u0669]+/g);
    stats.numbers += numberMatches?.length ?? 0;

    const punctuationMatches = text.match(/[.,!?;:،؛؟…«»"'()[\]{}—–-]/g);
    stats.punctuation += punctuationMatches?.length ?? 0;
  }

  function addOffsetKeyword(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.offsetKeyword,
      value: `offset${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'offset'.length;
  }

  function addPluralKeyword(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.pluralKeyword,
      value: `plural${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'plural'.length;
  }

  function addSelectKeyword(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.selectKeyword,
      value: `select${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'select'.length;
  }

  function addRightAngleOpenTag(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.rightAngleOpenTag,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addStemOption(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      markType: MARK_TYPES.stemOption,
      referenceId: params?.referenceId,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
  }

  function addSkeletonSeparator(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.skeletonSeparator,
      value: `::${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 2;
  }

  function addDateArgumentName(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.dateArgumentName,
      value: `date${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'date'.length;
  }

  function addTimeArgumentName(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.timeArgumentName,
      value: `time${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'time'.length;
  }

  function addOptionDelimiterEnd(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.optionDelimiterEnd,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addRightAngleCloseTag(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `>${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.rightAngleCloseTag,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addOffsetValue(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.offsetValue,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
  }

  function addLeftAngleOpenTag(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.leftAngleOpenTag,
      value: '<' + `${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.tags += 1;
    stats.icuSyntaxChars += 1;
  }

  function addStemOptionSeparator(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `/${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.stemOptionSeparator,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addOptionDelimiterStart(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.optionDelimiterStart,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addLeftAngleCloseTag(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.leftAngleCloseTag,
      value: '</' + `${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 2;
  }

  function addNumberArgumentName(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.numberArgumentName,
      value: `number${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'number'.length;
  }

  function addDedicatedFormatter(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.dedicatedFormatter,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
  }

  function addSelectOrdinalKeyword(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.selectOrdinalKeyword,
      value: `selectordinal${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 'selectordinal'.length;
  }

  function addArgumentNameDelimiterStart(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `{${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.argumentNameDelimiterStart,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addDateTimeSkeletonPattern(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.dateTimeSkeletonPattern,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
  }

  function addSelectOption(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      depth: params?.depth,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.selectOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.selectBranches += 1;
  }

  function addPluralOption(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      depth: params?.depth,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.pluralOption,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.pluralBranches += 1;
  }

  function addArgumentNameDelimiterEnd(params?: SharedParamsMethods) {
    rootSpan.appendChild(createSpanElement({
      depth: params?.depth,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      value: `}${params?.appendValue ?? ''}`,
      markType: MARK_TYPES.argumentNameDelimiterEnd,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));
    stats.icuSyntaxChars += 1;
  }

  function addArgumentName(params?: ArgumentNameParams) {
    rootSpan.appendChild(createSpanElement({
      depth: params?.depth,
      dependsOn: params?.dependsOn,
      referenceId: params?.referenceId,
      markType: MARK_TYPES.argumentName,
      variableType: params?.variableType,
      value: `${params?.value}${params?.appendValue ?? ''}`,
      formattingChars: rootParams.withFormatting && params?.formattingChars,
    }));

    const name = String(params?.value ?? '').trim();
    if (!name) {
      return;
    }

    stats.variables.add(name);
    stats.icuSyntaxChars += name.length;

    if (params?.variableType === 'number') {
      stats.numberVariables.add(name);
    }
    if (params?.variableType === 'date') {
      stats.dateVariables.add(name);
    }
    if (params?.variableType === 'time') {
      stats.timeVariables.add(name);
    }
  }

  return {
    stats,
    addStem,
    rootSpan,
    addComma,
    addPound,
    addRawText,
    addTagValue,
    addStemOption,
    addOffsetColon,
    addOffsetValue,
    addSelectOption,
    addPluralOption,
    addArgumentName,
    addOffsetKeyword,
    addPluralKeyword,
    addSelectKeyword,
    addDateArgumentName,
    addTimeArgumentName,
    addLeftAngleOpenTag,
    addRightAngleOpenTag,
    addSkeletonSeparator,
    addLeftAngleCloseTag,
    addOptionDelimiterEnd,
    addRightAngleCloseTag,
    addNumberArgumentName,
    addDedicatedFormatter,
    addStemOptionSeparator,
    addOptionDelimiterStart,
    addSelectOrdinalKeyword,
    addDateTimeSkeletonPattern,
    addArgumentNameDelimiterEnd,
    addArgumentNameDelimiterStart,
  };
};
