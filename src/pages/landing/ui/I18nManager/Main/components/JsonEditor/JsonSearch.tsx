import { memo } from 'react';
import { useForm } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { Menu, Group, TextInput, ActionIcon, CloseButton } from '@mantine/core';

type SearchFilter = 'all' | 'key' | 'value';

type Props = {
  onSearch: (query: string) => void;
  onFilterChange: (filter: SearchFilter) => void;
};

export const JsonSearch = memo(({ onSearch, onFilterChange }: Props) => {
  const t = useTranslations('i18nManager');

  const debouncedSearch = useDebouncedCallback((q: string) => onSearch(q), 200);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      query: '',
      filter: 'all' as SearchFilter,
    },
    onValuesChange: (values, previous) => {
      if (values.query !== previous.query) {
        debouncedSearch(values.query);
      }
      if (values.filter !== previous.filter) {
        onFilterChange(values.filter);
      }
    },
  });

  const filterValue = form.getValues().filter;
  const queryValue = form.getValues().query;

  // const selectedStyle = {
  //   color: 'var(--mantine-color-blue-6)',
  //   backgroundColor: 'var(--mantine-color-blue-0)',
  // };

  return (
    <TextInput
      size="xs"
      key={form.key('query')}
      leftSection={<IconSearch size={14} />}
      rightSectionWidth={queryValue ? 50 : 40}
      placeholder={t('jsonEditor.search.searchJsonContent')}
      rightSection={(
        <Group gap={0} wrap="nowrap">
          {queryValue && (
            <CloseButton
              size="sm"

              onClick={() => form.setFieldValue('query', '')}
            />
          )}
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon size="xs" variant="subtle" aria-label="Filter search">
                <IconFilter size="80%" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>{t('jsonEditor.search.searchIn')}</Menu.Label>
              <Menu.Item
                bd={filterValue === 'all' ? '1px solid var(--mantine-color-blue-6)' : undefined}

                onClick={() => form.setFieldValue('filter', 'all')}
              >
                {t('jsonEditor.search.searchFilterAll')}
              </Menu.Item>
              <Menu.Item
                bd={filterValue === 'key' ? '1px solid var(--mantine-color-blue-6)' : undefined}

                onClick={() => form.setFieldValue('filter', 'key')}
              >
                {t('jsonEditor.search.searchFilterKey')}
              </Menu.Item>
              <Menu.Item
                bd={filterValue === 'value' ? '1px solid var(--mantine-color-blue-6)' : undefined}

                onClick={() => form.setFieldValue('filter', 'value')}
              >
                {t('jsonEditor.search.searchFilterValue')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
      {...form.getInputProps('query')}
    />
  );
});

JsonSearch.displayName = 'JsonSearch';
