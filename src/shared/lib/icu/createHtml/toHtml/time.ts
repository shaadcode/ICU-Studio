import type { TimeElement } from '@formatjs/icu-messageformat-parser';

import { createMessageId } from '../../createMessageId';
import type { SharedToHtmlHelpersParams } from '../types';
import { isRichDateTimeSkeleton, isSimpleDateTimeSkeleton } from '../../typeGuards';

type Params = SharedToHtmlHelpersParams<TimeElement>;

export const timeToHtml = (params: Params) => {
  const { methods, message } = params;
  const id = createMessageId();

  if (!params.ctx) {
    throw new Error('ctx is undefined');
  }

  methods.addArgumentNameDelimiterStart({ dependsOn: id });
  methods.addArgumentName({ referenceId: id, value: message.value });
  methods.addComma();
  methods.addTimeArgumentName();
  if (isSimpleDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addDedicatedFormatter({ value: message.style });
  }

  if (isRichDateTimeSkeleton(message.style)) {
    methods.addComma();
    methods.addSkeletonSeparator();
    methods.addDateTimeSkeletonPattern({ value: message.style.pattern });
  }
  methods.addArgumentNameDelimiterEnd({ dependsOn: id });
};
