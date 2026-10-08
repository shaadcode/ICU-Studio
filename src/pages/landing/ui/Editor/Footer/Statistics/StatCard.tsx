import { memo } from 'react';
import { Text, Paper, Stack } from '@mantine/core';

type Props = {
  label: string;
  hint?: string;
  value: number | string;
};

export const StatCard = memo(({ hint, label, value }: Props) => (
  <Paper p="sm" withBorder radius="md" style={{ flex: 1, minWidth: 0 }}>
    <Stack gap={2}>
      <Text truncate size="xs" c="dimmed">
        {label}
      </Text>
      <Text fw={700} size="xl">
        {value}
      </Text>
      {hint && (
        <Text size="xs" c="dimmed">
          {hint}
        </Text>
      )}
    </Stack>
  </Paper>
));

StatCard.displayName = 'StatCard';
