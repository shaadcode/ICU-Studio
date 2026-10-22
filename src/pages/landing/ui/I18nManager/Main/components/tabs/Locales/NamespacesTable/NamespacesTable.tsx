// components/tabs/Structure/NamespacesTable.tsx
import { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { useSelection } from '@mantine/hooks';
import { IconFileText, IconSearchOff, IconInfoCircle } from '@tabler/icons-react';
import { Card, Text, Table, Group, Stack, Center, Divider, Tooltip, Checkbox, ThemeIcon, ScrollArea, ActionIcon } from '@mantine/core';

import { NamespaceSearch } from './NamespaceSearch';
import { NamespaceTableRow } from './NamespaceTableRow';
import { SortNamespacesMenu } from './SortNamespacesMenu';
import type { LocaleAnalysis } from '@/pages/landing/model/patterns/types';
import type { SortDirection, NamespaceSortColumn } from './SortNamespacesMenu';
import type { Locale, Project } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';
import { AddNamespaceModal } from '../../Structure/DetectedStructureTree/HandleAddNamespaceModal/AddNamespaceModal';

type SortState = { direction: SortDirection; column: NamespaceSortColumn };

type Props = {
  projectData: Project;
  selectedLocale: Locale;
  project: BaseProjectInfo;
  localeAnalysis: undefined | LocaleAnalysis;
};

export const NamespacesTable = ({ project, projectData, localeAnalysis, selectedLocale }: Props) => {
  const t = useTranslations('i18nManager');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ column: 'name', direction: 'asc' });
  const isBaseLocale = project.baseLocale?.language.code === selectedLocale.language.code;
  const [selection, selectionHandlers] = useSelection({
    data: projectData.namespaces.map(ns => ns.path),
  });
  const namespacesByLocale = useMemo(
    () => projectData.namespaces.filter(ns => ns.locale.language.code === selectedLocale.language.code),
    [projectData.namespaces, selectedLocale],
  );

  const filteredAndSortedNamespaces = useMemo(() => {
    let list = namespacesByLocale;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(ns => ns.name.toLowerCase().includes(query));
    }
    return [...list].sort((a, b) => {
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
  }, [namespacesByLocale, searchQuery, sort, localeAnalysis]);

  const isSearchEmpty = namespacesByLocale.length > 0 && filteredAndSortedNamespaces.length === 0;
  const isCompletelyEmpty = namespacesByLocale.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="md" justify="space-between">
        <Group gap="xs">
          <Text fw={600} size="sm" tt="capitalize">
            {t('namespaces')}
            {' '}
            {'('}
            {namespacesByLocale.length}
            {')\r'}
          </Text>
          {selectedLocale && (
            <>
              <Divider my={6} orientation="vertical" />
              <Text span fw={400} c="dimmed">{selectedLocale.language.code.toUpperCase()}</Text>
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
            project={project}
            projectData={projectData}
            buttonProps={{ variant: 'default', styles: { root: { borderStyle: 'dashed' } } }}
          />
        </Group>
      </Group>

      {isCompletelyEmpty
        ? (
            <Center py="xl">
              <Stack gap="sm" align="center">
                <ThemeIcon size={50} radius="xl" color="gray" variant="light"><IconFileText size={26} /></ThemeIcon>
                <Text size="sm" c="dimmed" ta="center">{t('localesTab.noNamespacesFound')}</Text>
              </Stack>
            </Center>
          )
        : (
            <>
              <ScrollArea>
                <Table ta="center" verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w={40}>
                        <Checkbox
                          checked={selectionHandlers.isAllSelected()}
                          indeterminate={selectionHandlers.isSomeSelected()}

                          onChange={() =>
                            selectionHandlers.isAllSelected()
                              ? selectionHandlers.resetSelection()
                              : selectionHandlers.setSelection(projectData.namespaces.map(ns => ns.path))}
                        />
                      </Table.Th>
                      <Table.Th>{t('localesTab.table.namespace')}</Table.Th>
                      <Table.Th>{t('localesTab.table.completion')}</Table.Th>
                      <Table.Th>
                        <Group gap={4} wrap="nowrap">
                          <Text inherit>{t('localesTab.table.translatedKeys.label')}</Text>
                          <Tooltip
                            w={240}
                            multiline
                            withArrow
                            position="top"
                            label={t('localesTab.table.translatedKeys.tooltip')}
                          >
                            <ActionIcon size="xs" color="gray" variant="subtle" aria-label="more info">
                              <IconInfoCircle size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Th>
                      <Table.Th>{t('localesTab.table.missing')}</Table.Th>
                      <Table.Th>{t('localesTab.table.extra')}</Table.Th>
                      <Table.Th>{t('localesTab.table.status')}</Table.Th>
                      <Table.Th>{t('localesTab.table.lastUpdated')}</Table.Th>
                      <Table.Th w={40} />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredAndSortedNamespaces.map(ns => (
                      <NamespaceTableRow
                        key={ns.path}
                        namespace={ns}
                        projectData={projectData}
                        isBaseLocale={isBaseLocale}
                        isSelected={selection.includes(ns.path)}
                        nsAnalysis={localeAnalysis?.namespaces[ns.name]}

                        onToggleSelect={selectionHandlers.toggle}
                      />
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {isSearchEmpty && (
                <Center py="xl">
                  <Stack gap="sm" align="center">
                    <ThemeIcon size={50} radius="xl" color="gray" variant="light"><IconSearchOff size={26} /></ThemeIcon>
                    <Text size="sm" c="dimmed" ta="center">{t('localesTab.noSearchResults')}</Text>
                  </Stack>
                </Center>
              )}
            </>
          )}
    </Card>
  );
};
