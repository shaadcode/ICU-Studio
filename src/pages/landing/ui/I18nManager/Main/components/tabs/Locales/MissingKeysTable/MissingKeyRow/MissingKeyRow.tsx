import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Table, Badge } from '@mantine/core';
import { IconMinus, IconAlertTriangle } from '@tabler/icons-react';

import classes from './MissingKeyRow.module.css';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { TranslationEntry } from '@/pages/landing/model/patterns/types';

type Props = {
  entry: TranslationEntry;
};

export const MissingKeyRow = memo(({ entry }: Props) => {
  const t = useTranslations('i18nManager');
  const isMissing = entry.status === 'missing';
  const isEmpty = entry.status === 'empty';
  const setEntityData = i18nManagerStore.use.actions().setEntityData;
  return (
    <Table.Tr>
      <Table.Td>
        <Text
          fz="sm"
          truncate
          maw={200}
          td="underline"
          ff="monospace"
          style={{ cursor: 'pointer' }}
          className={classes['entry-key']}

          onClick={() => setEntityData(entry.namespace)}
        >
          {entry.key}
        </Text>
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
      </Table.Td>

      <Table.Td />
    </Table.Tr>
  );
});

MissingKeyRow.displayName = 'MissingKeyRow';
