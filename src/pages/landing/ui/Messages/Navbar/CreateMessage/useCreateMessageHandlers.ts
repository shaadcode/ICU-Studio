import { type } from 'arktype';
import { useTranslations } from 'use-intl';
import { open } from '@tauri-apps/plugin-dialog';
import { join, basename } from '@tauri-apps/api/path';
import { notifications } from '@mantine/notifications';
import { useForm, schemaResolver } from '@mantine/form';
import { useHotkeys, useDisclosure } from '@mantine/hooks';
import { create, exists, readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

import type { MessageSchema } from './CreateMessage';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { MESSAGES_DIR, createMessagesDir } from '@/shared/lib/tauri';
import { messagesStore } from '@/pages/landing/config/store/messages';

export function useCreateMessageHandlers() {
  const t = useTranslations('messages');
  const tCommon = useTranslations('common');
  const messagesLocalStore = messagesStore.use.messagesLocalStore();
  const setMessages = messagesStore.use.actions().setMessages;

  const schema = type({
    name: type('string >= 5')
      .configure({ message: t('validations.addNewMessage.name.length') }),
  });
  const form = useForm<{ name: string }>({
    validate: schemaResolver(schema),
    initialValues: {
      name: '',
    },
  });

  const [opened, drawerHandlers] = useDisclosure(false);

  const handleAddNewMessageFileInStore = async (newMessageData: MessageSchema) => {
    if (!messagesLocalStore) {
      throw new Error('messages store is undefined');
    }
    await messagesLocalStore.set(newMessageData.dirPath, newMessageData);
    await messagesLocalStore.save();
    const newMessages = await messagesLocalStore.entries<MessageSchema>() ?? [];
    setMessages(newMessages);
  };

  const openCreateMode = () => {
    form.reset();
    drawerHandlers.open();
  };

  const handleCreateNewFile = async (formData: { name: string }) => {
    form.setSubmitting(true);

    try {
      await createMessagesDir();

      const fileName = `${formData.name}.txt`;
      const relativePath = await join(MESSAGES_DIR, fileName);
      const isFileExist = await exists(relativePath, { baseDir: BaseDirectory.AppData });

      if (isFileExist) {
        return notifications.show({
          color: 'orange',
          title: t('notifications.fileExists.title'),
          message: t('notifications.fileExists.message', { name: fileName }),
        });
      }

      const file = await create(relativePath, { baseDir: BaseDirectory.AppData });
      await file.write(new TextEncoder().encode(`{variable}`));
      await file.close();

      await handleAddNewMessageFileInStore({
        name: formData.name,
        dirPath: relativePath,
      });

      drawerHandlers.close();
    } catch (error) {
      console.error('Error creating message file:', error);
    } finally {
      form.setSubmitting(false);
    }
  };

  const handleOpenExistFile = async () => {
    const messageFilePath = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: 'txt files',
          extensions: ['txt'],
        },
      ],
    });
    if (messageFilePath) {
      const fileNameOnly = await basename(messageFilePath, '.txt');
      const relativePath = await join(MESSAGES_DIR, `${fileNameOnly}.txt`);
      const content = await readTextFile(messageFilePath);

      await createMessagesDir();

      const isFileExist = await exists(relativePath, { baseDir: BaseDirectory.AppData });

      if (isFileExist) {
        notifications.show({
          color: 'orange',
          autoClose: 5000,
          title: t('notifications.fileExists.title'),
          message: t('notifications.fileExists.message', { name: fileNameOnly }),
        });
        form.setSubmitting(false);
      }

      await writeTextFile(relativePath, content, { baseDir: BaseDirectory.AppData });

      await handleAddNewMessageFileInStore({
        name: fileNameOnly,
        dirPath: relativePath,
      });
    }
  };

  useHotkeys([
    [hotkeys.messages.createNewMessage, () => openCreateMode()],
    [hotkeys.messages.openNewMessage, () => handleOpenExistFile()],
  ]);
  return {
    t,
    form,
    opened,
    tCommon,
    openCreateMode,
    drawerHandlers,
    handleCreateNewFile,
    handleOpenExistFile,
  };
}
