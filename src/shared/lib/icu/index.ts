import { minimalParser } from './minimalParser';
import TagVariable from './components/TagVariable';
import { collectVariables } from './collectVariables';
import { createSpanElement } from './createSpanElement';
import { extractInfoAndHtml } from './createHtml/createHtml';

export {
  TagVariable,
  minimalParser,
  collectVariables,
  createSpanElement,
  extractInfoAndHtml as createHtml,
};
