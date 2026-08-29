import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import type { ICUEditorStore } from '.';
import type { collectVariables } from '@/shared/lib/icu';
import type { MessageElementsType } from '@/shared/lib/icu/types';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type ICUEditorMessageSlice = {
  readonly message: string | undefined;
  actions: ICUEditorMessageSliceActions;
  variablesValues: Record<string, string>;
  variables: ReturnType<typeof collectVariables>;
  parsedMessage: undefined | Array<MessageFormatElement>;

};

type ICUEditorMessageSliceActions = {
  setMessage: (value: ICUEditorMessageSlice['message']) => void;
  setVariables: (value: ICUEditorMessageSlice['variables']) => void;
  setParsedMessage: (value: ICUEditorMessageSlice['parsedMessage']) => void;
  initialVariablesValues: (variables: ICUEditorMessageSlice['variables']) => void;
  setVariablesValues: (callback: (prevValue: ICUEditorMessageSlice['variablesValues']) => ICUEditorMessageSlice['variablesValues']) => void;
};

export const createIcuEditorMessageSlice: ZustandSlice<ICUEditorStore, ICUEditorMessageSlice> = (set, get) => ({
  variables: [],
  message: undefined,
  variablesValues: {},
  parsedMessage: undefined,
  actions: {
    setMessage: value => set({ message: value }),
    setVariables: value => set({ variables: value }),
    setParsedMessage: value => set({ parsedMessage: value }),
    setVariablesValues: callback => set({
      variablesValues: callback(get().variablesValues),
    }),
    initialVariablesValues: (variables) => {
      const initializedVariablesValues = variables.reduce((prevAcc, currentValue) => {
        const [variableName, typeEnum] = currentValue;
        const addProperty = (value: string | number | ((chunks: any) => string)) => ({
          ...prevAcc,
          [variableName]: value,
        });

        const typesMap = {
          2: () => addProperty('14'),
          1: () => addProperty('john'),
          5: () => addProperty('other'),
          6: () => addProperty('other'),
          3: () => addProperty(new Date().toISOString()),
          4: () => addProperty(new Date().toISOString()),
          8: () => addProperty(chunks => `<span>${chunks}</span>`),
        } as const satisfies Record<Exclude<MessageElementsType, 7 | 0>, () => object>;

        // @ts-expect-error
        const handler = typesMap[typeEnum] as undefined | (() => object);

        return handler ? handler() : prevAcc;
      }, {});

      return set({ variablesValues: initializedVariablesValues });
    },
  },
});
