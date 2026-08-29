import { parse } from '@formatjs/icu-messageformat-parser';

import { extractInfoAndHtml } from './createHtml/createHtml';

type Options = {
  withFormatting?: true;
};
export const textToHtml = (text: string, opts?: Options) => {
  const parsed = parse(text);
  const html = extractInfoAndHtml(parsed, { withFormatting: opts?.withFormatting });

  return html;
};
