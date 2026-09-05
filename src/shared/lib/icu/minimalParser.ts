import { wrap } from 'comlink';
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

export const createMinimalParserWorker = () => {
  const worker = new Worker(
    new URL('./workers/minimalParser.js', import.meta.url),
    { type: 'module' },
  );

  /**
   * parse in worker
   */
  const minimalParserWorker = wrap<typeof minimalParser>(worker);

  return { worker, minimalParserWorker };
};
