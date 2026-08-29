import type { PoundElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';

type Params = SharedToHtmlHelpersParams<PoundElement>;

export const poundToHtml = (params: Params) => {
  const { methods } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  const depth = Math.max(params.ctx.depth - 1, 1);

  methods.addPound({ referenceId: `depth-${depth}` });
};
