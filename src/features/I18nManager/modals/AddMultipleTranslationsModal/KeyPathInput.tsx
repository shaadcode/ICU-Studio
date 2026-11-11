import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconDatabaseSearch } from '@tabler/icons-react';
import { Tooltip, TextInput, ActionIcon } from '@mantine/core';

import type { Locale } from '@/pages/landing/config/store/i18nManager/types';

export type KeyPathInputProps = {
  isLoading?: boolean;
  initialValue?: string;
  isSearching?: boolean;
  onSearch?: () => void;
  debounceDelay?: number;
  activeLocale?: null | Locale;
  onChange?: (value: string) => void;
  onDebounceChange?: (value: string) => void;
};

const KeyPathInput = ({
  onChange,
  onSearch,
  isLoading,
  isSearching,
  activeLocale,
  initialValue,
  onDebounceChange,
  debounceDelay = 300,
}: KeyPathInputProps) => {
  const t = useTranslations('i18nManager');
  const [value, setValue] = useState(initialValue ?? '');
  const debouncedHandler = useDebouncedCallback((val: string) => onDebounceChange?.(val), debounceDelay);

  useEffect(() => {
    debouncedHandler(value);
  }, [value, debouncedHandler]);

  return (
    <TextInput
      withAsterisk
      ff="monospace"
      placeholder="e.g., auth.login.title"
      disabled={!!activeLocale || isLoading}
      label={t('localesTab.missingKeysTable.table.key')}
      rightSection={(
        <Tooltip label={t('localesTab.modals.addMultiple.searchKey')}>
          <ActionIcon
            bdrs={6}
            size="sm"
            color="blue"
            loading={isSearching}
            disabled={!value.trim() || !!activeLocale || isLoading}

            onClick={onSearch}
          >
            <IconDatabaseSearch size="70%" />
          </ActionIcon>
        </Tooltip>
      )}

      onChange={(e) => {
        const incomingValue = e.currentTarget.value;
        onChange?.(incomingValue);
        setValue(incomingValue);
      }}
    />
  );
};

export default KeyPathInput;
