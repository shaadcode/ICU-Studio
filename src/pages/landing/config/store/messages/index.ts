import { create } from 'zustand';
import { attemptAsync } from 'es-toolkit';
import { extname } from '@tauri-apps/api/path';
import type { Store } from '@tauri-apps/plugin-store';
import type { UnwatchFn } from '@tauri-apps/plugin-fs';
import { watch, remove, exists, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

import { checkFileExist } from '@/shared/lib/tauri';
import { createSelectors } from '@/shared/config/zustand/createSelector';
import type { MessageSchema } from '@/pages/landing/ui/Messages/Navbar/CreateMessage/CreateMessage';

export type MessagesStore = {
  isDirty: boolean;
  actions: MessagesStoreActions;
  messages: Array<MessageSchema>;
  initialContent: string | undefined;
  /**
   * tauri store - for saved messages
   */
  messagesLocalStore: Store | undefined;
  messageWatcher: UnwatchFn | undefined;
  selectedMessage: undefined | MessageSchema;
};

type MessagesStoreActions = {
  resetDirty: () => void;
  updateDirty: (v: boolean) => void;
  unwatchAllMessages: (() => Promise<void>);
  setMessagesLocalStore: (value: Store) => void;
  deleteMessage: (message: MessageSchema) => Promise<void>;
  setMessages: (messagesEntries: MessagesStore['messages']) => void;
  setSelectedMessage: (value: MessagesStore['selectedMessage']) => void;
  setInitialContent: (content: MessagesStore['initialContent']) => void;
  watchAllMessages: (messages?: MessagesStore['messages']) => Promise<void>;
};

const messagesStoreBase = create<MessagesStore>()((set, get) => ({
  messages: [],
  isDirty: false,
  messageWatcher: undefined,
  initialContent: undefined,
  selectedMessage: undefined,
  messagesLocalStore: undefined,
  actions: {
    updateDirty: v => set({ isDirty: v }),
    resetDirty: () => set({ isDirty: false }),
    setMessages: messages => set({ messages }),
    setSelectedMessage: value => set({ selectedMessage: value }),
    setInitialContent: content => set({ initialContent: content }),
    unwatchAllMessages: async () => {
      const { messageWatcher } = get();
      if (messageWatcher) {
        messageWatcher();
        set({ messageWatcher: undefined });
      }
    },
    setMessagesLocalStore: async (store) => {
      const messages = await store.get<Array<MessageSchema>>('messages') ?? [];
      const { actions } = get();
      await actions.watchAllMessages(messages);
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
            .filter(m => m.dirPath !== messageData.dirPath),
        });
      });
    },

    watchAllMessages: async (incomingAllMessages) => {
      const { actions, messages } = get();
      const targetMessages = incomingAllMessages ?? messages;
      await actions.unwatchAllMessages();

      if (incomingAllMessages?.length === 0 || messages.length === 0) {
        return;
      }

      const paths = targetMessages.map(msg => msg.dirPath);
      const [e] = await attemptAsync(async () => {
        const unwatchFn = await watch(
          paths,
          (event) => {
            event.paths.forEach(async (path) => {
              const isFileExists = await exists(path);
              const extName = await extname(path);
              if (!isFileExists || extName !== 'txt') {
                return console.error('message file not found - watcher');
              }

              const messageContent = await readTextFile(path);
              actions.setInitialContent(messageContent);
            });
          },
        );

        set({ messageWatcher: unwatchFn });
      });
      if (e) {
        return console.error('نظارت بر فایل‌ها ناموفق بود:', e);
      }
    },
  },
}));

export const messagesStore = createSelectors(messagesStoreBase);
