import { useTranslations } from 'use-intl';
import { IconSearch } from '@tabler/icons-react';
import { memo, useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { TextInput, CloseButton } from '@mantine/core';

type Props = {
  onSearch: (query: string) => void;
};

export const LocaleSearch = memo(({ onSearch }: Props) => {
  const t = useTranslations('i18nManager');
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebouncedValue(inputValue, 200);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <TextInput
      size="xs"
      value={inputValue}
      leftSection={<IconSearch size={14} />}
      placeholder={t('localesTab.searchLocales')}
      rightSection={inputValue && <CloseButton onClick={() => setInputValue('')} />}

      onChange={e => setInputValue(e.currentTarget.value)}
    />
  );
});

LocaleSearch.displayName = 'LocaleSearch';
