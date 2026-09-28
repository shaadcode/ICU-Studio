import { parse } from '@formatjs/icu-messageformat-parser';

import { extractInfoAndHtml } from './createHtml/createHtml';

type Options = {
  withFormatting?: true;
};
export const textToHtml = (rawMessage: string, opts?: Options) => {
  const parsedMessage = parse(rawMessage);
  const html = extractInfoAndHtml({
    rawMessage,
    parsedMessage,
    opts: { withFormatting: opts?.withFormatting },
  });

  return html;
};
