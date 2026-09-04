import type { ValueOf } from 'type-fest';

import type { MARK_TYPES } from './createHtml/createHtml';

export type FormattingNode = {
  append?: string;
  prepend?: string;
};

export type CreateSpanElemParams = {
  value: string;
  depth?: number;
  withBr?: boolean;
  dependsOn?: string;
  referenceId?: string;
  formattingChars?: FormattingNode;
  markType: ValueOf<typeof MARK_TYPES>;
};

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
    elem.prepend(params.formattingChars.prepend ?? '');
    elem.append(params.formattingChars.append ?? '');
  }

  if (params.withBr) {
    elem.innerHTML += '\n';
  }
  return elem;
};
