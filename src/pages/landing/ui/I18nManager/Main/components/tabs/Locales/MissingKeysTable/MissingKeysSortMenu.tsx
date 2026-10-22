import { useTranslations } from 'use-intl';
import { Menu, Tooltip, ActionIcon } from '@mantine/core';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

type Props = {
  sort: SortState;
  onSortChange: (next: SortState) => void;
};

type SortState = {
  direction: 'asc' | 'desc';
  column: 'key' | 'status' | 'baseValue' | 'translatedValue';
};

export const MissingKeysSortMenu = ({ sort, onSortChange }: Props) => {
  const t = useTranslations('i18nManager');

  const columns: SortState['column'][] = ['key', 'baseValue', 'translatedValue', 'status'];

  const toggleDirection = () =>
    onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' });

  return (
    <Menu withArrow shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Tooltip withArrow label={t('localesTab.missingKeysTable.sort.label')}>
          <ActionIcon color="gray" variant="light" aria-label="sort">
            <IconArrowsSort size={16} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('localesTab.missingKeysTable.sort.sortBy')}</Menu.Label>
        {columns.map(col => (
          <Menu.Item
            key={col}
            rightSection={sort.column === col ? <IconSortAscending size={14} /> : null}

            onClick={() => onSortChange({ column: col, direction: sort.direction })}
          >
            {t(`localesTab.missingKeysTable.table.${col}`)}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item
          leftSection={sort.direction === 'asc'
            ? <IconSortAscending size={14} />
            : <IconSortDescending size={14} />}

          onClick={toggleDirection}
        >
          {sort.direction === 'asc'
            ? t('localesTab.missingKeysTable.sort.ascending')
            : t('localesTab.missingKeysTable.sort.descending')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
