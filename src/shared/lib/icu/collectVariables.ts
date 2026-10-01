import type { DistributedOmit } from 'type-fest';
import type { DateElement, TimeElement, PluralElement, NumberElement, MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { isTagElement, isDateElement, isTimeElement, isNumberElement, isPluralElement, isSelectElement, isArgumentElement } from '@formatjs/icu-messageformat-parser';

import { ExtendedErrorKind } from './types';
import { formatMessageElementsKeywordByEnum } from './constants';
import type { ParserError, MessageElementsTypeEnum, MessageElementsTypeKeyword } from './types';

export type VariableInfo = {
  name: string;
  enumType: MessageElementsTypeEnum;
  keywordType: MessageElementsTypeKeyword;
  config?: {
    // for Plural
    offset?: number;
    // for select
    conditions?: string[];
    dateStyle?: DateElement['style'];
    timeStyle?: TimeElement['style'];
    numberStyle?: NumberElement['style'];
    pluralType?: PluralElement['pluralType'];
  };
};

export const collectVariables = (
  ast: Array<MessageFormatElement>,
  vars = /* @__PURE__ */ new Map<string, VariableInfo>(),
  errors: Array<ParserError> = [],
) => {
  ast.forEach((el) => {
    const enumType = el.type;
    const keywordType = formatMessageElementsKeywordByEnum[enumType];

    const assignObj = (value: DistributedOmit<VariableInfo, 'enumType' | 'keywordType'>): VariableInfo => ({
      ...value,
      enumType,
      keywordType,
    });

    if (
      isArgumentElement(el)
      || isDateElement(el)
      || isTimeElement(el)
      || isNumberElement(el)
    ) {
      if (vars.has(el.value)) {
        const existingVariable = vars.get(el.value);
        if (existingVariable?.enumType !== el.type) {
          errors.push({
            location: el.location!,
            message: 'CONFLICT_VARIABLE_NAME',
            kind: ExtendedErrorKind.CONFLICT_VARIABLE_NAME,
          });
        }
      }

      if (isArgumentElement(el)) {
        vars.set(el.value, assignObj({ name: el.value }));
      }

      if (isNumberElement(el)) {
        vars.set(el.value, assignObj({ name: el.value, config: { numberStyle: el.style } }));
      }

      if (isTimeElement(el)) {
        vars.set(el.value, assignObj({ name: el.value, config: { timeStyle: el.style } }));
      }

      if (isDateElement(el)) {
        vars.set(el.value, assignObj({ name: el.value, config: { dateStyle: el.style } }));
      }
      // vars.set(el.value, assignObj({ name: el.value }));
    }
    if (isPluralElement(el) || isSelectElement(el)) {
      if (isPluralElement(el)) {
        vars.set(el.value, assignObj({
          name: el.value,
          config: { offset: el.offset, pluralType: el.pluralType },
        }));
      }
      if (isSelectElement(el)) {
        vars.set(el.value, assignObj({
          name: el.value,
          config: { conditions: Object.keys(el.options) },
        }));
      }

      Object.keys(el.options).forEach((k) => {
        // @ts-expect-error
        collectVariables(el.options[k].value, vars, errors);
      });
    }
    if (isTagElement(el)) {
      vars.set(el.value, assignObj({ name: el.value }));
      collectVariables(el.children, vars, errors);
    }
  });

  return {
    errors,
    variables: Array.from(vars.entries()) as ReadonlyArray<[string, VariableInfo]>,
  };
};
