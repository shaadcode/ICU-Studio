import { attempt } from 'es-toolkit/util';
import { parse } from '@formatjs/icu-messageformat-parser';
import type { ParserOptions, MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import type { ParserError } from './types';

type Options = {
  parserOptions: ParserOptions;
};
export const minimalParser = (message: string, opts?: Options) => {
  if (message === '') {
    return [null, []] as [null, Array<MessageFormatElement>];
  }

  return attempt<Array<MessageFormatElement>, ParserError>(() => parse(message, {
    shouldParseSkeletons: true,
    ...opts?.parserOptions,
  }));
};
