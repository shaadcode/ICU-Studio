import { minimalParser } from './minimalParser';
import { extractInfoAndHtml } from './createHtml/createHtml';
import { collectVariables } from './collectVariables';
import { createSpanElement } from './createSpanElement';

export {
  extractInfoAndHtml as createHtml,
  minimalParser,
  collectVariables,
  createSpanElement,
};
