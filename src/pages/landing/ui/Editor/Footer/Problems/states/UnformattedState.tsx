import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { IconWand, IconHelpHexagonFilled } from '@tabler/icons-react';
import { Text, Stack, Button, Center, ThemeIcon } from '@mantine/core';

type Props = {
  onFormat: () => void;
};

export const UnformattedState = memo(({ onFormat }: Props) => {
  const tEditor = useTranslations('editor');

  return (
    <Center style={{ flex: 1 }}>
      <Stack gap="sm" maw={280} align="center">
        <ThemeIcon size="lg" radius="xl" color="yellow" variant="light">
          <IconHelpHexagonFilled size={20} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center">
          {tEditor('widgets.problems.unformattedHint')}
        </Text>
        <Button
          size="xs"
          color="yellow"
          variant="light"
          leftSection={<IconWand size={14} />}

          onClick={onFormat}
        >
          {tEditor('widgets.problems.formatNow')}
        </Button>
      </Stack>
    </Center>
  );
});

UnformattedState.displayName = 'UnformattedState';
