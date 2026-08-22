import type { ICUEditorStore } from '.';
import type { ICUTemplate } from '../../model/icuTemplates';
import type { ZustandSlice } from '@/shared/config/zustand/types';

export type ICUTemplatesSearchSlice = {
  forceInputValue: string;
  actions: ICUTemplatesSearchSliceActions;
  selectedTemplate: undefined | ICUTemplate;
};

type ICUTemplatesSearchSliceActions = {
  setSelectedTemplate: (data: ICUTemplate) => void;
  forceChangeSearchInputValue: (value: string) => void;
};

export const createICUTemplatesSearchSlice: ZustandSlice<
  ICUEditorStore,
  ICUTemplatesSearchSlice
> = set => ({
  forceInputValue: '',
  selectedTemplate: undefined,
  actions: {
    setSelectedTemplate: data => set({ selectedTemplate: data }),
    forceChangeSearchInputValue: value => set({ forceInputValue: value }),
  },
});
