import type React from 'react';
import type { ReactNode } from 'react';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import type { ICUEditorStore } from '.';
import { TagVariable, collectVariables } from '@/shared/lib/icu';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import type { VariableInfo } from '@/shared/lib/icu/collectVariables';
import type { MessageElementsTypeEnum } from '@/shared/lib/icu/types';

export type ICUEditorMessageSlice = {
  readonly message: string | undefined;
  actions: ICUEditorMessageSliceActions;
  parsedMessage: undefined | Array<MessageFormatElement>;
  variables: Array<VariableInfo & { value: Date | string | number | ((chunks: ReactNode) => React.JSX.Element) }>;
};

type ICUEditorMessageSliceActions = {
  setVariables: (value: Array<MessageFormatElement>) => void;
  setMessage: (value: ICUEditorMessageSlice['message']) => void;
  setParsedMessage: (value: ICUEditorMessageSlice['parsedMessage']) => void;
  updateVariableInitialValue: (valueName: string, value: Date | string | number) => void;
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
          3: () => addProperty(new Date()),
          4: () => addProperty(new Date()),
          1: () => addProperty(`[${info.name}]`),
          5: () => addProperty(info.config?.conditions?.[0] ?? 'unknown'),
          8: () => addProperty(children => <TagVariable variable={info}>{children}</TagVariable>),
        } as const satisfies Record<MessageElementsTypeEnum, () => object>;
        return typesMap[info.enumType]();
      }) as ICUEditorMessageSlice['variables'];
    // console.log(parsedMessage);
    return set({ variables: initializedVariablesValues });
  };
}
