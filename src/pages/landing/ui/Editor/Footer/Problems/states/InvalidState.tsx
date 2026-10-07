import { memo } from 'react';
import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { Text, Stack, Group } from '@mantine/core';

import CodeSnippet from '../CodeSnippet/CodeSnippet';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { FixButton } from '../../../ValidationErrorBubble/FixButton/FixButton';

type Props = {
  editor: Editor;
  errorLocation: NonNullable<ICUEditorStore['errorLocation']>;
  validationError: NonNullable<ICUEditorStore['validationError']>;
};

export const InvalidState = memo(({ editor, errorLocation, validationError }: Props) => {
  const t = useTranslations('editor');
  const clearValidationError = icuEditorStore.use.actions().clearValidationError;
  const formatContent = icuEditorStore.use.actions().formatContent;

  const handleOnFixed = () => {
    clearValidationError();
    formatContent();
  };
  return (
    <Stack h="100%">
      <Text size="sm">
        {t(`parsingErrors.${validationError.message}`)}
      </Text>
      <CodeSnippet
        editor={editor}
        errorLocation={errorLocation}
        validationError={validationError}
      />

      <Text c="dark" size="sm">
        {t(`parsingErrorsDescription.${validationError.message}`)}
      </Text>

      <Group mt="auto">
        <FixButton
          context={{
            editor,
            errorLocation,
            validationError,
            rawMessage: editor?.state.doc.textContent ?? '',
          }}

          onFixed={handleOnFixed}
        />
      </Group>
    </Stack>
  );
});

InvalidState.displayName = 'InvalidState';
