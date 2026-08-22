import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { isTagElement, isDateElement, isTimeElement, isNumberElement, isPluralElement, isSelectElement, isArgumentElement } from '@formatjs/icu-messageformat-parser';

/**
 * for format.js lib
 * Collect all variables in an AST to Record<string, TYPE>
 * @param ast AST to collect variables from
 * @param vars Record of variable name to variable type
 */
export const collectVariables = (ast: Array<MessageFormatElement>, vars = /* @__PURE__ */ new Map()) => {
  ast.forEach((el) => {
    if (isArgumentElement(el) || isDateElement(el) || isTimeElement(el) || isNumberElement(el)) {
      if (vars.has(el.value)) {
        const existingType = vars.get(el.value);
        if (existingType !== el.type && existingType !== 6 && existingType !== 5) {
          throw new Error(`Variable ${el.value} has conflicting types`);
        }
      } else {
        vars.set(el.value, el.type);
      }
    }
    if (isPluralElement(el) || isSelectElement(el)) {
      vars.set(el.value, el.type);
      Object.keys(el.options).forEach((k) => {
        // @ts-expect-error
        collectVariables(el.options[k].value, vars);
      });
    }
    if (isTagElement(el)) {
      vars.set(el.value, el.type);
      collectVariables(el.children, vars);
    }
  });

  return {
    keys: Array.from(vars.keys()),
  };
};
