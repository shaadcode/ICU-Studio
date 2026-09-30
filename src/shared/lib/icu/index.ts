import TagVariable from './components/TagVariable';
import { createMessageId } from './createMessageId';
import { collectVariables } from './collectVariables';
import { getMarkAttributes } from './getMarkAttribute';
import { createSpanElement } from './createSpanElement';
import { extractInfoAndHtml } from './createHtml/createHtml';
import { minimalParser, createMinimalParserWorker } from './minimalParser';
import { getLineRangeOffset, getLineRangeOffsetByOneLine } from './getLineRangeOffset';

export {
  TagVariable,
  minimalParser,
  createMessageId,
  collectVariables,
  getMarkAttributes,
  createSpanElement,
  getLineRangeOffset,
  createMinimalParserWorker,
  getLineRangeOffsetByOneLine,
  extractInfoAndHtml as createHtml,
};
