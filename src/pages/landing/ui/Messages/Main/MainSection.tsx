import { Text, Stack, ThemeIcon } from '@mantine/core';
import { IconMessageCircleQuestion } from '@tabler/icons-react';

import ICUEditor from '../../Editor/Editor';
import { useMessageMainSectionHandlers } from './useMessageMainSectionHandlers';

const MessagesMainSection = () => {
  const handlers = useMessageMainSectionHandlers();

  if (!handlers.selectedMessage) {
    return (
      <Stack gap="xs" my="auto" align="center" justify="center">
        <ThemeIcon size="lg" color="gray" variant="light">
          <IconMessageCircleQuestion size={20} />
        </ThemeIcon>
        <Text fw={500}>
          {handlers.t('states.notSelected.title')}
        </Text>
        <Text size="sm" maw={320} c="dimmed" ta="center">
          {handlers.t('states.notSelected.description')}
        </Text>
      </Stack>
    );
  }

  return (
    <ICUEditor onUpdateEditor={({ editor }) => handlers.checkIsDirty(editor)} />
  );
};

export default MessagesMainSection;
