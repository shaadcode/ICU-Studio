import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Group, Paper, Stack, Badge, useComputedColorScheme } from '@mantine/core';

import type { VariableInfo } from '@/shared/lib/icu/collectVariables';
import { makeColorValue, VARIABLE_COLORS } from '@/shared/lib/mantine';

type Props = {
  variable: VariableInfo;
};

export const VariableItem = memo(({ variable }: Props) => {
  const t = useTranslations('editor');
  const typeLabel = t(`messageFormatEnum.${variable.enumType}`);

  const { color } = VARIABLE_COLORS[variable.keywordType];
  const colorScheme = useComputedColorScheme('light');
  const colorValue = makeColorValue(color, colorScheme);
  return (
    <Paper p="xs" withBorder radius="sm">
      <Stack gap={6}>
        <Group gap="xs" wrap="nowrap" justify="space-between">
          <Group gap={6} wrap="nowrap">
            <Text fw={600} truncate size="sm" style={{ color: colorValue }}>
              {variable.name}
            </Text>
          </Group>
          <Badge size="xs" tt="lowercase" variant="light">
            {typeLabel}
          </Badge>
        </Group>

      </Stack>
    </Paper>
  );
});

VariableItem.displayName = 'VariableItem';
