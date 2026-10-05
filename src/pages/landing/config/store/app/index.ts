import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DisclosureSlice } from './disclosure';
import type { AppConfigSlice } from './configSlice';
import { createAppConfigSlice } from './configSlice';
import { createDisclosureSlice } from './disclosure';
import type { MessagesSlice } from './messagesSlice';
import { createMessagesSlice } from './messagesSlice';
import { createSelectors } from '@/shared/config/zustand/createSelector';

export type AppStore = AppConfigSlice & DisclosureSlice & MessagesSlice;

const appStoreBase = create<AppStore>()(persist((...rest) => {
  const appConfigSlice = createAppConfigSlice(...rest);
  const disclosureSlice = createDisclosureSlice(...rest);
  const messagesSlice = createMessagesSlice(...rest);
  return {
    ...appConfigSlice,
    ...disclosureSlice,
    ...messagesSlice,
    actions: {
      ...appConfigSlice.actions,
      ...disclosureSlice.actions,
      ...messagesSlice.actions,
    },
  };
}, {
  name: 'app-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: state => ({
    messageContent: state.messageContent,
    selectedMessage: state.selectedMessage,
  }),
}),
);

export const appStore = createSelectors(appStoreBase);
