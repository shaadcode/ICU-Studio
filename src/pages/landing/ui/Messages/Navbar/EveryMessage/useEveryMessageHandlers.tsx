import { useEffect } from 'react';
import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useTranslations } from 'use-intl';
import { useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

import type { MessageSchema } from '../CreateMessage/CreateMessage';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { messagesStore } from '@/pages/landing/config/store/messages';
import { checkFileExist, createMessagesDir, createMessagePaths } from '@/shared/lib/tauri';

const appWindow = getCurrentWindow();

type Props = {
  message: MessageSchema;
};

export function useEveryMessageHandlers(_props: Props) {
  const tCommon = useTranslations('common');
  const t = useTranslations('messages');
  const selectedMessage = messagesStore.use.selectedMessage();
  const initialContent = messagesStore.use.initialContent();
  const isDirty = messagesStore.use.isDirty();
  const deleteMessage = messagesStore.use.actions().deleteMessage;
  const resetDirty = messagesStore.use.actions().resetDirty;
  const setInitialContent = messagesStore.use.actions().setInitialContent;
  const setSelectedMessage = messagesStore.use.actions().setSelectedMessage;
  const editorInstance = icuEditorStore.use.editorInstance();

  const handleSaveMessage = async () => {
    if (!selectedMessage || !editorInstance) {
      return;
    }
    await createMessagesDir();
    const { relativePath } = await createMessagePaths(selectedMessage);

    const newContent = editorInstance.getText();
    await writeTextFile(relativePath, newContent, {
      baseDir: BaseDirectory.AppData,
    });

    resetDirty();
    setInitialContent(newContent);
  };

  const handleSelectMessage = async (message: MessageSchema) => {
    const isFileExist = await checkFileExist(message.dirPath);

    if (!isFileExist) {
      deleteMessage(message);
      return notifications.show({
        color: 'red',
        title: t('notifications.readError.title'),
        message: t('notifications.readError.message'),
      });
    }

    const messageContent = await readTextFile(
      message.dirPath,
      { baseDir: BaseDirectory.AppData },
    );
    setSelectedMessage(message);
    return setInitialContent(messageContent);
  };

  useHotkeys(
    [
      ['mod+S', handleSaveMessage],
    ],
    [],
    true,
  );

  const dirtyModal = (
    message?: MessageSchema,
    opts?: { onConfirm: () => void | Promise<void> },
  ) => modals.openConfirmModal({
    cancelProps: { tt: 'capitalize' },
    confirmProps: { tt: 'capitalize' },
    title: t('modals.dirtyMessage.title'),
    labels: { cancel: tCommon('cancel'), confirm: tCommon('saveAndContinue') },
    children: (
      <Text size="sm">
        {t('modals.dirtyMessage.message')}
      </Text>
    ),
    onConfirm: async () => {
      await handleSaveMessage();
      message && await handleSelectMessage(message);
      await opts?.onConfirm?.();
    },
  });

  useEffect(() => {
    const unlistenPromise = appWindow.onCloseRequested(async (e) => {
      e.preventDefault();

      if (_props.message.dirPath === selectedMessage?.dirPath && isDirty) {
        dirtyModal(undefined, { onConfirm: async () => await appWindow.destroy() });
      }
    });

    return () => {
      unlistenPromise.then(unlisten => unlisten());
    };
  }, [_props.message.dirPath, selectedMessage?.dirPath, isDirty]);

  useEffect(() => {
    if (selectedMessage && !initialContent) {
      handleSelectMessage(selectedMessage);
    }
  }, [selectedMessage]);

  return {
    tCommon,
    isDirty,
    dirtyModal,
    deleteMessage,
    selectedMessage,
    handleSelectMessage,
  };
};
