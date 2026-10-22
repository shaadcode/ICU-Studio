import { TextInput } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconSearch } from '@tabler/icons-react';

type Props = {
  onSearch: (query: string) => void;
};

export const MissingKeysSearch = ({ onSearch }: Props) => {
  const t = useTranslations('i18nManager');

  return (
    <TextInput
      size="xs"
      radius="md"
      style={{ width: 220 }}
      leftSection={<IconSearch size={14} />}
      placeholder={t('localesTab.missingKeysTable.searchPlaceholder')}

      onChange={event => onSearch(event.currentTarget.value)}
    />
  );
};
