import { IconWorld, IconSettings } from '@tabler/icons-react';
import { Box, Text, Group, Title, Button, ThemeIcon } from '@mantine/core';

type Props = {
  title: string;
  scanLabel: string;
  onScan: () => void;
  description: string;
  settingsLabel: string;
  onSettings: () => void;
};

export const ViewHeader = ({
  title,
  onScan,
  scanLabel,
  onSettings,
  description,
  settingsLabel,
}: Props) => {
  return (
    <Group wrap="nowrap" align="flex-start" justify="space-between">
      <Group gap="sm" wrap="nowrap" align="center">
        <ThemeIcon size={40} radius="md" color="blue" variant="light">
          <IconWorld size={22} />
        </ThemeIcon>
        <Box>
          <Title fw={600} order={4}>
            {title}
          </Title>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Box>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <Button
          size="xs"
          variant="filled"
          leftSection={<IconWorld size={16} />}

          onClick={onScan}
        >
          {scanLabel}
        </Button>
        <Button
          size="xs"
          variant="default"
          leftSection={<IconSettings size={16} />}

          onClick={onSettings}
        >
          {settingsLabel}
        </Button>
      </Group>
    </Group>
  );
};
