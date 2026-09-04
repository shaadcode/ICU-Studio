import { minimalParser } from './minimalParser';
import TagVariable from './components/TagVariable';
import { createMessageId } from './createMessageId';
import { collectVariables } from './collectVariables';
import { getMarkAttributes } from './getMarkAttribute';
import { createSpanElement } from './createSpanElement';
import { extractInfoAndHtml } from './createHtml/createHtml';

export {
  TagVariable,
  minimalParser,
  createMessageId,
  collectVariables,
  getMarkAttributes,
  createSpanElement,
  extractInfoAndHtml as createHtml,
};
