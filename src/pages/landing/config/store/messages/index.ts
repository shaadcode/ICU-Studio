import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import type { Store } from '@tauri-apps/plugin-store';
import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';
import { persist, createJSONStorage } from 'zustand/middleware';

import { checkFileExist } from '@/shared/lib/tauri';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import type { MessageSchema } from '@/pages/landing/ui/Messages/Navbar/CreateMessage/CreateMessage';

export type MessagesStore = {
  isDirty: boolean;
  actions: MessagesStoreActions;
  initialContent: string | undefined;
  /**
   * tauri store - for saved messages
   */
  messagesLocalStore: Store | undefined;
  messages: Array<[string, MessageSchema]>;
  selectedMessage: undefined | MessageSchema;
};

type MessagesStoreActions = {
  resetDirty: () => void;
  updateDirty: (v: boolean) => void;
  setMessagesLocalStore: (value: Store) => void;
  deleteMessage: (message: MessageSchema) => Promise<void>;
  setMessages: (messagesEntries: MessagesStore['messages']) => void;
  setSelectedMessage: (value: MessagesStore['selectedMessage']) => void;
  setInitialContent: (content: MessagesStore['initialContent']) => void;
};

const messagesStoreBase = create<MessagesStore>()(persist((set, get) => {
  return {
    messages: [],
    isDirty: false,
    initialContent: undefined,
    selectedMessage: undefined,
    messagesLocalStore: undefined,
    actions: {
      updateDirty: v => set({ isDirty: v }),
      resetDirty: () => set({ isDirty: false }),
      setMessages: messages => set({ messages }),
      setSelectedMessage: value => set({ selectedMessage: value }),
      setInitialContent: content => set({ initialContent: content }),
      setMessagesLocalStore: async (store) => {
        const messages = await store.entries<MessageSchema>();
        set({ messages, messagesLocalStore: store });
      },
      deleteMessage: async (messageData) => {
        const store = get().messagesLocalStore;
        const messages = get().messages;
        const selectedMessage = get().selectedMessage;
        await attemptAsync(async () => {
          await store?.delete(messageData.dirPath);
          await store?.save();
          const isFileExist = await checkFileExist(messageData.dirPath);

          if (isFileExist) {
            await remove(messageData.dirPath, { baseDir: BaseDirectory.AppData });
          }

          if (messageData.dirPath === selectedMessage?.dirPath) {
            set({ selectedMessage: undefined });
          }

          set({
            messages: messages
              .filter(([_, value]) => value.dirPath !== messageData.dirPath),
          });
        });
      },
    },
  };
}, {
  name: 'messages-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: state => ({
    messageContent: state.initialContent,
    selectedMessage: state.selectedMessage,
  }),
}),
);

export const messagesStore = createSelectors(messagesStoreBase);
