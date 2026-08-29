import type { DateElement } from '@formatjs/icu-messageformat-parser';

import type { SharedToHtmlHelpersParams } from '../types';
import { isRichDateTimeSkeleton, isSimpleDateTimeSkeleton } from '../../typeGuards';

type Params = SharedToHtmlHelpersParams<DateElement>;

export const dateToHtml = (params: Params) => {
  const { methods, message } = params;

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addArgumentNameDelimiterStart();
  methods.addArgumentName({ value: message.value });
  methods.addComma();
  methods.addDateArgumentName();

  if (isRichDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addSkeletonSeparator();
    methods.addDateTimeSkeletonPattern({ value: message.style.pattern });
  }
  if (isSimpleDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addDedicatedFormatter({ value: message.style });
  }
  methods.addArgumentNameDelimiterEnd();
};
