import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { IconMessageOff } from '@tabler/icons-react';
import { Text, Group, Stack, Center, Loader, ThemeIcon } from '@mantine/core';

import EveryMessage from './EveryMessage/EveryMessage';
import CreateMessageFile from './CreateMessage/CreateMessage';
import { messagesStore } from '@/pages/landing/config/store/messages';

const MessagesNavbar = () => {
  const t = useTranslations('messages');
  const [isLoading, setIsLoading] = useState(true);
  const messages = messagesStore.use.messages();
  const setMessagesLocalStore = messagesStore.use.actions().setMessagesLocalStore;

  useEffect(() => {
    (async () => {
      const messagesStore = await load('messages.json', { autoSave: false });
      setMessagesLocalStore(messagesStore);
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
              messages.map(([_, message], i) => (
                <EveryMessage
                  message={message}
                  key={`${message.name}-${i}`}
                />
              ))
            )}
    </Stack>
  );
};

export default MessagesNavbar;
