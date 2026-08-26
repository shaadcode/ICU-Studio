import { parse } from '@formatjs/icu-messageformat-parser';

import { createHtml } from '@/pages/landing/ui/Editor/Controls/FormatMessage/createHtml';

export const textToHtml = (text: string) => {
  const parsed = parse(text);
  const html = createHtml(parsed);

  return html;
};
