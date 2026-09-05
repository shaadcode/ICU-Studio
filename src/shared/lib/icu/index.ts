import TagVariable from './components/TagVariable';
import { createMessageId } from './createMessageId';
import { collectVariables } from './collectVariables';
import { getMarkAttributes } from './getMarkAttribute';
import { createSpanElement } from './createSpanElement';
import { extractInfoAndHtml } from './createHtml/createHtml';
import { minimalParser, createMinimalParserWorker } from './minimalParser';

export {
  TagVariable,
  minimalParser,
  createMessageId,
  collectVariables,
  getMarkAttributes,
  createSpanElement,
  createMinimalParserWorker,
  extractInfoAndHtml as createHtml,
};
