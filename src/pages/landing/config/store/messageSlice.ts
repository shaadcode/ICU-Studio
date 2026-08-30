import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import type { ICUEditorStore } from '.';
import { collectVariables } from '@/shared/lib/icu';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import type { VariableInfo } from '@/shared/lib/icu/collectVariables';
import type { MessageElementsTypeEnum } from '@/shared/lib/icu/types';

export type ICUEditorMessageSlice = {
  readonly message: string | undefined;
  actions: ICUEditorMessageSliceActions;
  // variablesValues: Record<string, string>;
  parsedMessage: undefined | Array<MessageFormatElement>;
  variables: Array<VariableInfo & { value: string | number | ((chunks: string) => string) }>;

};

type ICUEditorMessageSliceActions = {
  setVariables: (value: Array<MessageFormatElement>) => void;
  setMessage: (value: ICUEditorMessageSlice['message']) => void;
  setParsedMessage: (value: ICUEditorMessageSlice['parsedMessage']) => void;
  updateVariableInitialValue: (valueName: string, value: string | number) => void;
};

export const createIcuEditorMessageSlice: ZustandSlice<ICUEditorStore, ICUEditorMessageSlice> = (set, get) => ({
  variables: [],
  message: undefined,
  parsedMessage: undefined,
  actions: {
    setVariables: setVariablesHandler(set),
    setMessage: value => set({ message: value }),
    setParsedMessage: value => set({ parsedMessage: value }),
    updateVariableInitialValue: (varName, value) => {
      const variables = get().variables;
      const result = variables.map((variable) => {
        if (variable.name === varName) {
          return { ...variable, value };
        }

        return variable;
      });

      return set({ variables: result });
    },
  },
});

type Variable = ICUEditorMessageSlice['variables'][number];

function setVariablesHandler(set: Parameters<ZustandSlice<ICUEditorStore, ICUEditorMessageSlice>>[0]) {
  return (parsedMessage: Parameters<ICUEditorMessageSliceActions['setVariables']>[0]): ReturnType<ICUEditorMessageSliceActions['setVariables']> => {
    const rawVariables = collectVariables(parsedMessage);
    const initializedVariablesValues = rawVariables
      .map((variable) => {
        const [, info] = variable;

        if (info.enumType === 0 || info.enumType === 7) {
          return {};
        }
        const addProperty = (initialValue: Variable['value']): Variable => ({
          ...info,
          value: initialValue,
        });

        const typesMap = {
          0: () => ({}),
          7: () => ({}),
          6: () => addProperty(1),
          2: () => addProperty(5),
          1: () => addProperty('john'),
          3: () => addProperty(new Date().toISOString()),
          4: () => addProperty(new Date().toISOString()),
          5: () => addProperty(info.config?.conditions?.[0] ?? 'unknown'),
          8: () => addProperty((chunks: any) => `<span>${chunks}</span>`),
        } as const satisfies Record<MessageElementsTypeEnum, () => object>;
        return typesMap[info.enumType]();
      }) as ICUEditorMessageSlice['variables'];
    // console.log(parsedMessage);
    return set({ variables: initializedVariablesValues });
  };
}
