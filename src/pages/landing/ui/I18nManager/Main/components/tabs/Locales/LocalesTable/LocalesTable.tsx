import { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { useSelection } from '@mantine/hooks';
import { IconSearchOff, IconInfoCircle, IconLanguageOff } from '@tabler/icons-react';
import { Text, Card, Table, Group, Stack, Center, Tooltip, Checkbox, ThemeIcon, ScrollArea, ActionIcon } from '@mantine/core';

import { SortMenu } from './SortMenu';
import { LocaleRow } from './LocaleTableRow';
import { LocaleSearch } from './LocaleSearch';
import type { ProjectAnalysisResult } from '@/pages/landing/model/patterns/types';
import type { Locale, Project } from '@/pages/landing/config/store/i18nManager/types';
import type { BaseProjectInfo } from '@/pages/landing/ui/I18nManager/Navbar/CreateNewProject/types';
import { AddLocaleModal } from '../../Structure/DetectedLocalesSection/AddLocaleModal/AddLocaleModal';

type SortState = {
  direction: 'asc' | 'desc';
  column: 'locale' | 'region' | 'namespaces' | 'completion';
};

type Props = {
  projectData: Project;
  selectedLocale: Locale;
  project: BaseProjectInfo;
  analysis: ProjectAnalysisResult;
  onSelectLocale: (code: Locale) => void;
};

export const LocalesTable = ({
  project,
  analysis,
  projectData,
  onSelectLocale,
  selectedLocale,
}: Props) => {
  const t = useTranslations('i18nManager');
  const [isPinnedBaseLocale, setIsPinnedBaseLocale] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selection, selectionHandlers] = useSelection({
    data: projectData.locales.map(l => l.language.code),
  });

  const [sort, setSort] = useState<SortState>({
    column: 'locale',
    direction: 'asc',
  });

  const filteredAndSortedLocales = useMemo(() => {
    const list = !searchQuery
      ? projectData.locales
      : projectData.locales.filter((locale) => {
          const query = searchQuery.toLowerCase();
          return (
            locale.language.code.toLowerCase().includes(query)
            || locale.native.toLowerCase().includes(query)
            || (locale.region && locale.region.toLowerCase().includes(query))
          );
        });

    list.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      switch (sort.column) {
        case 'locale':
          return a.language.code.localeCompare(b.language.code) * dir;
        case 'region':
          return (a.region ?? '').localeCompare(b.region ?? '') * dir;
        case 'completion': {
          const aC = analysis.locales[a.language.code]?.completionPercentage ?? 0;
          const bC = analysis.locales[b.language.code]?.completionPercentage ?? 0;
          return (aC - bC) * dir;
        }
        default:
          return 0;
      }
    });

    if (isPinnedBaseLocale) {
      const baseLocaleIndex = list
        .findIndex(l => l.language.code === project.baseLocale?.language.code);
      if (baseLocaleIndex > 0) {
        const [baseLocale] = list.splice(baseLocaleIndex, 1);
        baseLocale && list.unshift(baseLocale);
      }
    }
    return list;
  }, [sort, analysis, isPinnedBaseLocale, project.baseLocale, projectData.locales, searchQuery]);

  const isProjectEmpty = projectData.locales.length === 0;
  const isSearchEmpty = !isProjectEmpty && filteredAndSortedLocales.length === 0;

  return (
    <Card withBorder radius="md" padding="md">
      <Group mb="md" justify="space-between">
        <Text fw={600} size="sm">
          {t('localesTab.localesTitle')}
        </Text>

        <Group gap="xs" wrap="nowrap">
          <LocaleSearch onSearch={(query) => {
            setSearchQuery(query);
            selectionHandlers.resetSelection();
          }}
          />
          <SortMenu
            sort={sort}
            isPinnedBaseLocale={isPinnedBaseLocale}
            setIsPinnedBaseLocale={setIsPinnedBaseLocale}

            onSortChange={setSort}
          />
          <AddLocaleModal project={project} projectData={projectData} />
        </Group>
      </Group>

      <ScrollArea>
        <Table.ScrollContainer minWidth={500}>
          <Table ta="center">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}>
                  <Checkbox
                    checked={selectionHandlers.isAllSelected()}
                    indeterminate={selectionHandlers.isSomeSelected()}

                    onChange={() =>
                      selectionHandlers.isAllSelected()
                        ? selectionHandlers.resetSelection()
                        : selectionHandlers.setSelection(projectData.locales.map(l => l.language.code))}
                  />
                </Table.Th>
                <Table.Th>{t('localesTab.table.locale')}</Table.Th>
                <Table.Th>{t('localesTab.table.language')}</Table.Th>
                <Table.Th>{t('localesTab.table.region')}</Table.Th>
                <Table.Th>{t('localesTab.table.namespaces')}</Table.Th>

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
                <Table.Th>{t('localesTab.table.completion')}</Table.Th>
                <Table.Th>{t('localesTab.table.status')}</Table.Th>
                <Table.Th w={40} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredAndSortedLocales.map(locale => (
                <LocaleRow
                  locale={locale}
                  analysis={analysis}
                  projectData={projectData}
                  key={locale.language.code}
                  isPinnedBaseLocale={isPinnedBaseLocale}
                  isSelected={selection.includes(locale.language.code)}
                  isActive={locale.language.code === selectedLocale?.language.code}
                  isBase={locale.language.code === project.baseLocale?.language.code}

                  onClick={() => onSelectLocale(locale)}
                  onToggleSelect={selectionHandlers.toggle}
                />
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {(isProjectEmpty || isSearchEmpty) && (
          <Center py="xl">
            <Stack gap="sm" align="center">
              <ThemeIcon size={50} radius="xl" color="gray" variant="light">
                {isSearchEmpty ? <IconSearchOff size={26} /> : <IconLanguageOff size={26} />}
              </ThemeIcon>
              <Text size="sm" c="dimmed" ta="center">
                {isSearchEmpty
                  ? t('localesTab.noSearchResults')
                  : t('localesTab.emptyLocales')}
              </Text>
            </Stack>
          </Center>
        )}
      </ScrollArea>
    </Card>
  );
};
