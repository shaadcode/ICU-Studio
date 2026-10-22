import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Code, Table, Badge, Tooltip, Checkbox } from '@mantine/core';
import { IconCheck, IconMinus, IconAlertTriangle } from '@tabler/icons-react';

import type { TranslationEntry } from '@/pages/landing/model/patterns/types';

type Props = {
  isSelected: boolean;
  entry: TranslationEntry;
  onToggleSelect: (key: string) => void;
};

export const MissingKeyRow = memo(({ entry, isSelected, onToggleSelect }: Props) => {
  const t = useTranslations('i18nManager');

  const isMissing = entry.status === 'missing';
  const isEmpty = entry.status === 'empty';
  const isTranslated = entry.status === 'translated';

  return (
    <Table.Tr>
      <Table.Td>
        <Checkbox
          checked={isSelected}
          disabled={isTranslated}

          onChange={() => onToggleSelect(entry.key)}
        />
      </Table.Td>

      <Table.Td>
        <Tooltip withArrow openDelay={400} label={entry.key} position="top-start">
          <Code style={{ whiteSpace: 'nowrap' }}>{entry.key}</Code>
        </Tooltip>
      </Table.Td>

      <Table.Td>
        <Text size="sm" lineClamp={2} title={entry.baseValue}>
          {entry.baseValue || '—'}
        </Text>
      </Table.Td>

      <Table.Td>
        {entry.translatedValue
          ? (
              <Text size="sm" lineClamp={2} title={entry.translatedValue}>
                {entry.translatedValue}
              </Text>
            )
          : (
              <Text size="sm" c="dimmed">{'—'}</Text>
            )}
      </Table.Td>

      <Table.Td>
        {isMissing && (
          <Badge size="sm" color="red" variant="light" leftSection={<IconAlertTriangle size={12} />}>
            {t('localesTab.missingKeysTable.status.missing')}
          </Badge>
        )}
        {isEmpty && (
          <Badge size="sm" color="yellow" variant="light" leftSection={<IconMinus size={12} />}>
            {t('localesTab.missingKeysTable.status.empty')}
          </Badge>
        )}
        {isTranslated && (
          <Badge size="sm" color="teal" variant="light" leftSection={<IconCheck size={12} />}>
            {t('localesTab.missingKeysTable.status.translated')}
          </Badge>
        )}
      </Table.Td>

      <Table.Td />
    </Table.Tr>
  );
});

MissingKeyRow.displayName = 'MissingKeyRow';
