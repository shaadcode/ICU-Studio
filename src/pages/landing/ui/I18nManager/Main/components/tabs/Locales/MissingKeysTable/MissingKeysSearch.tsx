import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { TextInput, CloseButton } from '@mantine/core';

type Props = {
  onSearch: (query: string) => void;
};

export const MissingKeysSearch = ({ onSearch }: Props) => {
  const t = useTranslations('i18nManager');
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue] = useDebouncedValue(inputValue, 200);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);
  return (
    <TextInput
      size="xs"
      radius="md"
      style={{ width: 220 }}
      leftSection={<IconSearch size={14} />}
      placeholder={t('localesTab.missingKeysTable.searchPlaceholder')}
      rightSection={inputValue && <CloseButton onClick={() => setInputValue('')} />}

      onChange={e => setInputValue(e.currentTarget.value)}
    />
  );
};
