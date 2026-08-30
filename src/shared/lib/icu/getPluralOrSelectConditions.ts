import { isSelectElement } from '@formatjs/icu-messageformat-parser';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

type Params = {
  variableName: string;
  parsedMessage: ReadonlyArray<MessageFormatElement>;
};
export function getSelectConditions(rootParams: Params): Array<string> {
  let conditions: Array<string> = [];
  const traverse = (parsedMessage: ReadonlyArray<MessageFormatElement>) => parsedMessage.forEach((message) => {
    if (isSelectElement(message)) {
      if (message.value === rootParams.variableName) {
        conditions = Object.keys(message.options).flat();
      } else {
        Object
          .values(message.options)
          .map(option => traverse(option.value));
      }
    }
  });

  traverse(rootParams.parsedMessage);

  return conditions;
}
