// components/tabs/Structure/SortMenu.tsx
import { useTranslations } from 'use-intl';
import { Menu, Button } from '@mantine/core';
import { IconCheck, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

type SortDirection = 'asc' | 'desc';
type SortableColumn = 'locale' | 'region' | 'namespaces' | 'completion';

type Props = {
  isPinnedBaseLocale: boolean;
  sort: { column: SortableColumn; direction: SortDirection };
  setIsPinnedBaseLocale: React.Dispatch<React.SetStateAction<boolean>>;
  onSortChange: (sort: { column: SortableColumn; direction: SortDirection }) => void;
};

export const SortMenu = ({
  sort,
  onSortChange,
  isPinnedBaseLocale,
  setIsPinnedBaseLocale,
}: Props) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');

  const columns: Array<{ label: string; value: SortableColumn }> = [
    { value: 'locale', label: t('localesTab.table.locale') },
    { value: 'region', label: t('localesTab.table.region') },
    { value: 'namespaces', label: t('localesTab.table.namespaces') },
    { value: 'completion', label: t('localesTab.table.completion') },
  ];

  const currentColumnLabel = columns.find(c => c.value === sort.column)?.label;

  return (
    <Menu
      shadow="md"
      closeOnItemClick={false}
    >
      <Menu.Target>
        <Button
          size="xs"
          variant="light"
          leftSection={
            sort.direction === 'asc'
              ? <IconSortAscending size={14} />
              : <IconSortDescending size={14} />
          }
        >
          {currentColumnLabel}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('localesTab.sortBy')}</Menu.Label>
        {columns.map(column => (
          <Menu.Item
            key={column.value}
            leftSection={
              sort.column === column.value
                ? <IconCheck size={14} />
                : <span style={{ width: 14 }} />
            }

            onClick={() => onSortChange({ ...sort, column: column.value })}
          >
            {column.label}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Label>{t('localesTab.sortDirection')}</Menu.Label>
        <Menu.Item
          leftSection={
            sort.direction === 'asc'
              ? <IconCheck size={14} />
              : <span style={{ width: 14 }} />
          }

          onClick={() => onSortChange({ ...sort, direction: 'asc' })}
        >
          {t('localesTab.sortAscending')}
        </Menu.Item>
        <Menu.Item
          leftSection={
            sort.direction === 'desc'
              ? <IconCheck size={14} />
              : <span style={{ width: 14 }} />
          }

          onClick={() => onSortChange({ ...sort, direction: 'desc' })}
        >
          {t('localesTab.sortDescending')}
        </Menu.Item>

        <Menu.Label>{tCommon('other')}</Menu.Label>
        <Menu.Item
          leftSection={
            isPinnedBaseLocale
              ? <IconCheck size={14} />
              : <span style={{ width: 14 }} />
          }

          onClick={() => setIsPinnedBaseLocale(prev => !prev)}
        >
          {t('localesTab.pinBaseLocale')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
