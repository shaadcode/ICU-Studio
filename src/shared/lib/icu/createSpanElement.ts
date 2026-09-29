import type { ValueOf } from 'type-fest';

import type { MARK_TYPES } from './createHtml/createHtml';

export type FormattingPosition = {
  append?: FormattingData;
  prepend?: FormattingData;
};

export type CreateSpanElemParams = {
  value: string;
  depth?: number;
  dependsOn?: string;
  referenceId?: string;
  formattingChars?: FormattingPosition;
  markType: ValueOf<typeof MARK_TYPES>;
};

type FormattingData = Array<'hardBreak'>;

export const createSpanElement = (params: CreateSpanElemParams) => {
  const elem = document.createElement('span');
  elem.textContent = params.value;

  if (params.referenceId) {
    elem.dataset['referenceId'] = params.referenceId;
  }

  if (params.dependsOn) {
    elem.dataset['dependsOn'] = params.dependsOn;
  }

  if (params.markType) {
    elem.dataset['markType'] = params.markType;
  }

  if (params.depth) {
    elem.dataset['depth'] = String(params.depth);
  }

  if (params.formattingChars) {
    elem.prepend(...appendFormattingNodes(params.formattingChars.prepend));
    elem.append(...appendFormattingNodes(params.formattingChars.append));
  }

  return elem;
};

function appendFormattingNodes(formattingData: FormattingData = []): (Node | string)[] {
  const br = document.createElement('br');

  return formattingData.map((item) => {
    if (item === 'hardBreak') {
      return br;
    }

    return '';
  });
}
