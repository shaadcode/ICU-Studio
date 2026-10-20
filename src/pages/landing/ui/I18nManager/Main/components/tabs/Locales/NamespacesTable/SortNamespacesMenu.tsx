// components/tabs/Structure/SortNamespacesMenu.tsx
import { useTranslations } from 'use-intl';
import { Menu, Button } from '@mantine/core';
import { IconCheck, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

export type SortDirection = 'asc' | 'desc';
export type NamespaceSortColumn = 'name' | 'files' | 'completion';

type Props = {
  sort: { direction: SortDirection; column: NamespaceSortColumn };
  onSortChange: (sort: { direction: SortDirection; column: NamespaceSortColumn }) => void;
};

export const SortNamespacesMenu = ({ sort, onSortChange }: Props) => {
  const t = useTranslations('i18nManager');

  const columns: Array<{ label: string; value: NamespaceSortColumn }> = [
    { value: 'name', label: t('localesTab.table.namespace') },
    { value: 'files', label: t('localesTab.table.files') },
    { value: 'completion', label: t('localesTab.table.completion') },
  ];

  const currentColumnLabel = columns.find(c => c.value === sort.column)?.label;

  return (
    <Menu shadow="md" closeOnItemClick={false}>
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
      </Menu.Dropdown>
    </Menu>
  );
};
