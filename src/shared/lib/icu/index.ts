import TagVariable from './components/TagVariable';
import { createMessageId } from './createMessageId';
import { collectVariables } from './collectVariables';
import { createSpanElement } from './createSpanElement';
import { extractInfoAndHtml } from './createHtml/createHtml';
import { minimalParser, createMinimalParserWorker } from './minimalParser';
import { getMarkAttributes, getMarkViewAttributes } from './getMarkAttribute';
import { getLineRangeOffset, getLineRangeOffsetByOneLine } from './getLineRangeOffset';

export {
  TagVariable,
  minimalParser,
  createMessageId,
  collectVariables,
  createSpanElement,
  getMarkAttributes,
  getLineRangeOffset,
  getMarkViewAttributes,
  createMinimalParserWorker,
  getLineRangeOffsetByOneLine,
  extractInfoAndHtml as createHtml,
};
