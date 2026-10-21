import dayjs from 'dayjs';
// components/tabs/Structure/NamespacesTable.tsx
import { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { IconFileText, IconSearchOff } from '@tabler/icons-react';
import { Box, Text, Card, Table, Group, Stack, Center, Divider, Progress, Checkbox, ThemeIcon, ScrollArea } from '@mantine/core';

import { NamespaceSearch } from './NamespaceSearch';
import { SortNamespacesMenu } from './SortNamespacesMenu';
import { NamespaceTableRowMenu } from './NamespaceRowMenu';
import type { LocaleAnalysis } from '@/pages/landing/model/patterns/types';
import type { Locale } from '@/pages/landing/config/store/i18nManager/types';
import type { SortDirection, NamespaceSortColumn } from './SortNamespacesMenu';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { AddNamespaceModal } from '../../Structure/DetectedStructureTree/HandleAddNamespaceModal/AddNamespaceModal';

type SortState = {
  direction: SortDirection;
  column: NamespaceSortColumn;
};

type Props = {
  selectedLocale: Locale;
  localeAnalysis: undefined | LocaleAnalysis;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const NamespacesTable = ({
  projectData,
  localeAnalysis,
  selectedLocale,
}: Props) => {
  const t = useTranslations('i18nManager');
  const namespacesByLocale = useMemo(
    () => projectData
      .namespaces
      .filter(ns => ns.locale.language.code === selectedLocale.language.code),
    [projectData.namespaces, selectedLocale],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ column: 'name', direction: 'asc' });

  const filteredAndSortedNamespaces = useMemo(() => {
    let list = namespacesByLocale;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(ns => ns.name.toLowerCase().includes(query));
    }

    const sorted = [...list].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;

      switch (sort.column) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'completion': {
          const aC = localeAnalysis?.namespaces[a.name]?.completionPercentage ?? 0;
          const bC = localeAnalysis?.namespaces[b.name]?.completionPercentage ?? 0;
          return (aC - bC) * dir;
        }
        case 'files':
          return 1 * dir;
        default:
          return 0;
      }
    });

    return sorted;
  }, [namespacesByLocale, searchQuery, sort, localeAnalysis]);

  const isSearchEmpty = namespacesByLocale.length > 0 && filteredAndSortedNamespaces.length === 0;
  const isCompletelyEmpty = namespacesByLocale.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="md" justify="space-between">
        <Group gap="xs">
          <Text fw={600} size="sm" tt="capitalize">
            {t('namespaces')}
            {` (${namespacesByLocale.length})`}
          </Text>
          {selectedLocale && (
            <>
              <Divider my={6} orientation="vertical" />
              <Text span fw={400} c="dimmed">
                {selectedLocale.language.code.toUpperCase()}
              </Text>
            </>
          )}
        </Group>

        <Group gap="xs" wrap="nowrap">
          {!isCompletelyEmpty && (
            <>
              <NamespaceSearch onSearch={setSearchQuery} />
              <SortNamespacesMenu
                sort={sort}

                onSortChange={setSort}
              />
            </>
          )}
          <AddNamespaceModal
            projectData={projectData}
            buttonProps={{
              variant: 'default',
              styles: { root: { borderStyle: 'dashed' } },
            }}
          />
        </Group>

      </Group>

      {isCompletelyEmpty
        ? (
            <Center py="xl">
              <Stack gap="sm" align="center">
                <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                  <IconFileText size={26} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" ta="center">
                  {t('localesTab.noNamespacesFound')}
                </Text>
              </Stack>
            </Center>
          )
        : (
            <>
              <ScrollArea>
                <Table verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w={40}><Checkbox /></Table.Th>
                      <Table.Th>{t('localesTab.table.namespace')}</Table.Th>
                      <Table.Th>{t('localesTab.table.completion')}</Table.Th>
                      <Table.Th>{t('localesTab.table.status')}</Table.Th>
                      <Table.Th>{t('localesTab.table.lastUpdated')}</Table.Th>
                      <Table.Th w={40} />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredAndSortedNamespaces.map((ns) => {
                      const nsAnalysis = localeAnalysis?.namespaces[ns.name];
                      const completion = nsAnalysis?.completionPercentage ?? 0;

                      let status: 'active' | 'default' | 'partial' | 'missing' | 'complete' | 'incomplete' = 'missing';
                      let statusColor = 'red';
                      if (completion === 100) {
                        status = 'complete';
                        statusColor = 'teal';
                      } else if (completion > 0) {
                        status = 'partial';
                        statusColor = 'yellow';
                      }
                      const formattedDate = ns.lastModified
                        ? dayjs(ns.lastModified).format('MMM DD, YYYY - HH:mm')
                        : undefined;

                      return (
                        <Table.Tr key={ns.path}>
                          <Table.Td><Checkbox /></Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <IconFileText size={16} color="var(--mantine-color-blue-6)" />
                              <Text size="sm">{ns.name}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs" wrap="nowrap">
                              <Progress size="sm" radius="xl" value={completion} color={statusColor} style={{ flex: 1, minWidth: 60 }} />
                              <Text fw={500} size="xs">
                                {completion}
                                {'%'}
                              </Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={6}>
                              <Box w={8} h={8} bdrs={99} bg={statusColor} />
                              <Text size="sm" tt="capitalize">{t(`localesTab.status.${status}`)}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs" c="dimmed">{formattedDate ?? '-'}</Text>
                          </Table.Td>
                          <Table.Td>
                            <NamespaceTableRowMenu
                              namespace={ns}
                              projectData={projectData}
                            />
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {isSearchEmpty && (
                <Center py="xl">
                  <Stack gap="sm" align="center">
                    <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                      <IconSearchOff size={26} />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed" ta="center">
                      {t('localesTab.noSearchResults')}
                    </Text>
                  </Stack>
                </Center>
              )}
            </>
          )}

    </Card>
  );
};
