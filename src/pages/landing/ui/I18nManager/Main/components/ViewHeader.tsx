import { IconWorld } from '@tabler/icons-react';
import { Box, Text, Group, Title, ThemeIcon } from '@mantine/core';

type Props = {
  title: string;
  scanLabel: string;
  description: string;
  settingsLabel: string;
};

export const ViewHeader = ({
  title,
  description,
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

    </Group>
  );
};
