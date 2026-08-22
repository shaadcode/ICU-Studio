import { useEffect } from 'react';
import { useField } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { TextInput, InputClearButton } from '@mantine/core';

import { icuEditorStore } from '@/pages/landing/config/store';

type Props = {
  onChange?: (value: string) => void;
};

const SearchTemplatesInput = (props: Props) => {
  const t = useTranslations('common');
  const forceInputValue = icuEditorStore.use.forceInputValue();
  const forceChangeSearchInputValue = icuEditorStore.use.actions().forceChangeSearchInputValue;

  const field = useField({
    initialValue: '',
    onValueChange: props.onChange,
  });

  useEffect(() => {
    if (forceInputValue) {
      field.setValue(forceInputValue);
    }
  }, [forceInputValue]);

  return (
    <TextInput
      maxLength={32}
      placeholder={`${t('search')}...`}
      rightSection={field.getValue()
        ? (
            <InputClearButton onClick={() => {
              field.reset();
              forceChangeSearchInputValue('');
            }}
            />
          )
        : undefined}
      {...field.getInputProps()}
    />
  );
};

export default SearchTemplatesInput;
