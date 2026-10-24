import { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { IconKeyOff, IconSearchOff, IconInfoCircle } from '@tabler/icons-react';
import { Text, Card, Table, Group, Stack, Center, Tooltip, ThemeIcon, ScrollArea, ActionIcon } from '@mantine/core';

import { MissingKeysSearch } from './MissingKeysSearch';
import { MissingKeysSortMenu } from './MissingKeysSortMenu';
import { MissingKeyRow } from './MissingKeyRow/MissingKeyRow';
import type { Locale } from '@/pages/landing/config/store/i18nManager/types';
import type { TranslationEntry, ProjectAnalysisResult } from '@/pages/landing/model/patterns/types';

type Props = {
  baseLocale: Locale;
  selectedLocale: Locale;
  analysis: ProjectAnalysisResult;
};

type SortState = {
  direction: 'asc' | 'desc';
  column: 'key' | 'status' | 'baseValue' | 'translatedValue';
};

export const MissingKeysTable = ({ analysis, selectedLocale }: Props) => {
  const t = useTranslations('i18nManager');
  const [searchQuery, setSearchQuery] = useState('');
  const entries = Object
    .entries(analysis
      .locales[selectedLocale.language.code].namespaces)
    .reduce((acc, [_namespaceName, nsAnalysis]) => {
      return [...acc, ...(nsAnalysis?.missingEntries ?? [])];
    }, [] as Array<TranslationEntry>);

  const [sort, setSort] = useState<SortState>({
    column: 'key',
    direction: 'asc',
  });

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = entries;

    if (query) {
      list = list.filter(e =>
        e.key.toLowerCase().includes(query)
        || e.baseValue.toLowerCase().includes(query)
        || (e.translatedValue?.toLowerCase().includes(query) ?? false),
      );
    }

    return [...list].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      switch (sort.column) {
        case 'key':
          return a.key.localeCompare(b.key) * dir;
        case 'baseValue':
          return a.baseValue.localeCompare(b.baseValue) * dir;
        case 'translatedValue':
          return (a.translatedValue ?? '').localeCompare(b.translatedValue ?? '') * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        default:
          return 0;
      }
    });
  }, [entries, searchQuery, sort]);

  const isSourceEmpty = entries.length === 0;
  const isSearchEmpty = !isSourceEmpty && filteredAndSorted.length === 0;
  const missingCount = entries.filter(e => e.status === 'missing').length;
  const emptyCount = entries.filter(e => e.status === 'empty').length;

  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="md" wrap="nowrap" align="flex-start" justify="space-between">
        <Stack gap={2}>
          <Group gap="xs" wrap="nowrap">
            <Text fw={600} size="sm">
              {t('localesTab.missingKeysTable.title')}
            </Text>
            {selectedLocale && (
              <Text size="xs" c="dimmed">
                {`(${selectedLocale.language.code})`}
              </Text>
            )}
          </Group>
          <Text size="xs" c="dimmed">
            {t('localesTab.missingKeysTable.summary', { empty: emptyCount, missing: missingCount })}
          </Text>
        </Stack>

        <Group gap="xs" wrap="nowrap">
          <MissingKeysSearch
            onSearch={setSearchQuery}
          />
          <MissingKeysSortMenu
            sort={sort}

            onSortChange={setSort}
          />
        </Group>
      </Group>

      <ScrollArea>
        <Table.ScrollContainer minWidth={640}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('localesTab.missingKeysTable.table.key')}</Table.Th>
                <Table.Th>{t('localesTab.missingKeysTable.table.baseValue')}</Table.Th>
                <Table.Th>{t('localesTab.missingKeysTable.table.translatedValue')}</Table.Th>

                <Table.Th>
                  <Group gap={4} wrap="nowrap">
                    <Text inherit>{t('localesTab.missingKeysTable.table.status')}</Text>
                    <Tooltip
                      w={240}
                      multiline
                      withArrow
                      position="top"
                      label={t('localesTab.missingKeysTable.table.statusTooltip')}
                    >
                      <ActionIcon size="xs" color="gray" variant="subtle" aria-label="more info">
                        <IconInfoCircle size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Th>

                <Table.Th w={40} />
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {filteredAndSorted.map(entry => (
                <MissingKeyRow entry={entry} key={entry.key} />
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {(isSourceEmpty || isSearchEmpty) && (
          <Center py="xl">
            <Stack gap="sm" align="center">
              <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                {isSearchEmpty ? <IconSearchOff size={26} /> : <IconKeyOff size={26} />}
              </ThemeIcon>
              <Text size="sm" c="dimmed" ta="center">
                {isSearchEmpty
                  ? t('localesTab.missingKeysTable.noSearchResults')
                  : t('localesTab.missingKeysTable.emptyState')}
              </Text>
            </Stack>
          </Center>
        )}
      </ScrollArea>
    </Card>
  );
};
