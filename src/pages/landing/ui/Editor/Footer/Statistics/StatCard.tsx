import { memo } from 'react';
import { Text, Paper, Stack } from '@mantine/core';

type Props = {
  label: string;
  hint?: string;
  value: number | string;
};

export const StatCard = memo(({ hint, label, value }: Props) => (
  <Paper p="xs" withBorder radius="md" style={{ flex: 1, minWidth: 0 }}>
    <Stack gap={2}>
      <Text fz="xs" truncate c="dimmed">
        {label}
      </Text>
      <Text fz="xl" fw={700}>
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
