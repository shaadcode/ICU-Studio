import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { notifications } from '@mantine/notifications';
import { exists, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { IconTrash, IconMessageOff, IconDotsVertical, IconAlertTriangle } from '@tabler/icons-react';
import { Text, Menu, Group, Stack, Paper, Center, Loader, ThemeIcon, ActionIcon } from '@mantine/core';

import classes from './Messages.module.css';
import { appStore } from '@/pages/landing/config/store/app';
import CreateMessageFile from './CreateMessage/CreateMessage';
import type { MessageStoreSchema } from './CreateMessage/CreateMessage';

const MessagesNavbar = () => {
  const t = useTranslations('messages');
  const tCommon = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const messages = appStore.use.messages();
  const selectedMessage = appStore.use.selectedMessage();
  const deleteMessage = appStore.use.actions().deleteMessage;
  const setMessageContent = appStore.use.actions().setMessageContent;
  const setSelectedMessage = appStore.use.actions().setSelectedMessage;
  const setMessagesStore = appStore.use.actions().setMessagesStore;
  const handleSelectMessage = async (message: MessageStoreSchema) => {
    const isFileExist = await exists(message.dirPath, { baseDir: BaseDirectory.AppData });
    if (!isFileExist) {
      deleteMessage(message);
      return notifications.show({
        color: 'red',
        icon: <IconAlertTriangle size={18} />,
        title: t('notifications.readError.title'),
        message: t('notifications.readError.message'),
      });
    }

    const messageContent = await readTextFile(
      message.dirPath,
      { baseDir: BaseDirectory.AppData },
    );
    setSelectedMessage(message);
    return setMessageContent(messageContent);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const messagesStore = await load('messages.json', { autoSave: false });
      setMessagesStore(messagesStore);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Stack>
      <Group wrap="nowrap" justify="space-between">
        <Text tt="capitalize">
          {t('messages')}
        </Text>
        <CreateMessageFile />
      </Group>
      {isLoading
        ? (
            <Center py="xl">
              <Stack gap="xs" align="center">
                <Loader size="sm" />
                <Text fz="xs" c="dimmed" ta="center">
                  {t('loadingState')}
                </Text>
              </Stack>
            </Center>
          )
        : messages.length === 0
          ? (
              <Center py="xl">
                <Stack gap="xs" align="center">
                  <ThemeIcon
                    size={50}
                    radius="xl"
                    color="gray"
                    variant="light"
                  >
                    <IconMessageOff size="60%" stroke={1.5} />
                  </ThemeIcon>

                  <Text fz="sm" fw={600} ta="center" style={{ userSelect: 'none' }}>
                    {t('emptyState.title')}
                  </Text>

                  <Text fz="xs" maw={220} c="dimmed" ta="center">
                    {t('emptyState.description')}
                  </Text>
                </Stack>
              </Center>
            )
          : (
              messages.map(([_, message]) => {
                return (
                  <Paper
                    withBorder
                    component={Group}
                    key={message.name}
                    className={classes['messageContainer']}
                    mod={{
                      'data-is-active': message.dirPath === selectedMessage?.dirPath || undefined,
                    }}

                    onClick={() => handleSelectMessage(message)}
                  >
                    <Text fz="sm" truncate>
                      {message.name}
                    </Text>
                    <Menu withArrow shadow="md">
                      <Menu.Target>
                        <ActionIcon
                          size="sm"
                          radius="sm"
                          variant="subtle"
                          style={{ boxShadow: 'none' }}
                        >
                          <IconDotsVertical size="80%" />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          style={{ cursor: 'pointer' }}

                          onClick={() => deleteMessage(message)}
                        >
                          <Group gap="xs" wrap="nowrap">
                            <IconTrash size={16} color="red" />
                            <Text fz="xs" c="red" tt="capitalize">
                              {tCommon('delete')}
                            </Text>
                          </Group>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Paper>
                );
              })
            )}
    </Stack>
  );
};

export default MessagesNavbar;
