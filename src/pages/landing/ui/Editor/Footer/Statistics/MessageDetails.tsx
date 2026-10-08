import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Group, Stack, Divider } from '@mantine/core';

import { currentMessageStats } from './statistics.mock';

export const MessageDetails = memo(() => {
  const t = useTranslations('editor');

  const rows = [
    { key: 'characters', value: currentMessageStats.characters },
    { key: 'words', value: currentMessageStats.words },
    { key: 'variables', value: currentMessageStats.variables },
    { key: 'pluralBranches', value: currentMessageStats.pluralBranches },
    { key: 'selectBranches', value: currentMessageStats.selectBranches },
    { key: 'tags', value: currentMessageStats.tags },
    { key: 'maxNesting', value: currentMessageStats.maxNesting },
  ] as const;

  return (
    <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
      <Text fw={600} size="sm">
        {t('widgets.statistics.messageDetails')}
      </Text>

      <Stack gap={4}>
        {rows.map((row, i) => (
          <div key={row.key}>
            <Group wrap="nowrap" justify="space-between">
              <Group gap={4} wrap="nowrap">
                <Text size="sm" c="dimmed">
                  {'•\r'}
                </Text>
                <Text size="sm">{t(`widgets.statistics.${row.key}`)}</Text>
              </Group>
              <Text fw={500} size="sm">
                {row.value}
              </Text>
            </Group>
            {i < rows.length - 1 && <Divider my={4} />}
          </div>
        ))}
      </Stack>
    </Stack>
  );
});

MessageDetails.displayName = 'MessageDetails';
