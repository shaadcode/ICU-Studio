import { attemptAsync } from 'es-toolkit';
import type { Store } from '@tauri-apps/plugin-store';
import { exists, remove, BaseDirectory } from '@tauri-apps/plugin-fs';

import type { AppStore } from '.';
import type { ZustandSlice } from '@/shared/config/zustand/types';
import type { MessageStoreSchema } from '@/pages/landing/ui/Projects/Navbar/Header/CreateProject/CreateProject';

export type MessagesSlice = {
  messageContent: string;
  actions: MessagesSliceActions;
  messagesStore: Store | undefined;
  messages: Array<[string, MessageStoreSchema]>;
  selectedMessage: undefined | MessageStoreSchema;
};

type MessagesSliceActions = {
  setMessagesStore: (value: Store) => void;
  deleteMessage: (message: MessageStoreSchema) => Promise<void>;
  setMessages: (messagesEntries: MessagesSlice['messages']) => void;
  setSelectedMessage: (value: MessagesSlice['selectedMessage']) => void;
  setMessageContent: (content: MessagesSlice['messageContent']) => void;
};

export const createMessagesSlice: ZustandSlice<
  AppStore,
  MessagesSlice
> = (set, get) => ({
  messages: [],
  messageContent: '',
  messagesStore: undefined,
  selectedMessage: undefined,
  actions: {
    setMessages: messages => set({ messages }),
    setSelectedMessage: value => set({ selectedMessage: value }),
    setMessageContent: content => set({ messageContent: content }),
    setMessagesStore: async (store) => {
      const messages = await store.entries<MessageStoreSchema>();
      set({ messages, messagesStore: store });
    },
    deleteMessage: async (messageData) => {
      const store = get().messagesStore;
      const messages = get().messages;
      const selectedMessage = get().selectedMessage;
      await attemptAsync(async () => {
        await store?.delete(messageData.dirPath);
        await store?.save();
        const isFileExist = await exists(messageData.dirPath, { baseDir: BaseDirectory.AppData });

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
});
