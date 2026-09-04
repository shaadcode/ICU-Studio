import type { NumberElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { isRichNumberSkeleton, isSimpleNumberSkeleton } from '../../typeGuards';

type Params = SharedToHtmlHelpersParams<NumberElement>;

export const numberToHtml = (params: Params) => {
  const { methods, message } = params;
  const id = createMessageId();

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({ referenceId: id, value: message.value });
  methods.addComma();
  methods.addNumberArgumentName();

  if (isRichNumberSkeleton(message.style)) {
    methods.addComma();
    methods.addSkeletonSeparator();

    const tokens = message.style.tokens;
    tokens.forEach((token, tokenIndex) => {
      const tokenOptions = token.options;
      // add space
      if (tokenIndex < tokens.length - 1 && !tokenOptions.length) {
        methods.addStem({ value: `${token.stem} ` });
      } else {
        methods.addStem({ value: token.stem });
      }

      if (token.options.length) {
        token.options.forEach((stemOption) => {
          methods.addStemOptionSeparator();
          methods.addStemOption({ value: stemOption });
        });
      }
    });
  }

  if (isSimpleNumberSkeleton(message.style)) {
    methods.addComma();
    methods.addDedicatedFormatter({ value: message.style });
  }
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
