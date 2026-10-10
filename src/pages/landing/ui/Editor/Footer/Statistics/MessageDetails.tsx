// MessageDetails.tsx
import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Group, Stack, Divider } from '@mantine/core';

import type { MessageStats } from '@/shared/lib/icu/createHtml/stats';

type Props = {
  stats: MessageStats;
};

export const MessageDetails = memo(({ stats }: Props) => {
  const t = useTranslations('editor.widgets.statistics');

  const rows = [
    { key: 'characters', value: stats.characters },
    { key: 'words', value: stats.words },
    { key: 'variables', value: stats.variables.size },
    { key: 'pluralBranches', value: stats.pluralBranches },
    { key: 'selectBranches', value: stats.selectBranches },
    { key: 'tags', value: stats.tags },
    { key: 'maxNesting', value: stats.maxNesting },
    { key: 'textRatio', value: `${stats.textRatio}%` },
    { key: 'icuSyntaxRatio', value: `${stats.icuSyntaxRatio}%` },
    { key: 'numbers', value: stats.numbers },
    { key: 'punctuation', value: stats.punctuation },
  ] as const;

  return (
    <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
      <Text fw={600} size="sm">
        {t('messageDetails')}
      </Text>

      <Stack gap={4}>
        {rows.map((row, i) => (
          <div key={row.key}>
            <Group wrap="nowrap" justify="space-between">
              <Group gap={4} wrap="nowrap">
                <Text size="sm" c="dimmed">
                  {'•\r'}
                </Text>
                <Text size="sm">{t(`stats.${row.key}`)}</Text>
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
