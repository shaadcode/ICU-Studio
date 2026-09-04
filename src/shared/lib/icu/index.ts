import { minimalParser } from './minimalParser';
import TagVariable from './components/TagVariable';
import { collectVariables } from './collectVariables';
import { getMarkAttributes } from './getMarkAttribute';
import { createSpanElement } from './createSpanElement';
import { extractInfoAndHtml } from './createHtml/createHtml';

export {
  TagVariable,
  minimalParser,
  collectVariables,
  getMarkAttributes,
  createSpanElement,
  extractInfoAndHtml as createHtml,
};
