import { set } from 'es-toolkit/compat';
import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { notifications } from '@mantine/notifications';
import type { ContextModalProps } from '@mantine/modals';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { Text, Group, Stack, Button, TextInput } from '@mantine/core';

import { readJsonFileSafe } from '../lib';
import ICUEditor from '@/pages/landing/ui/Editor/Editor';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { Namespace } from '@/pages/landing/config/store/i18nManager/types';

export type CreateMessageEditorParams = {
  initialKey: string;
  namespace: Namespace;
};

type Props = CreateMessageEditorParams & {
  onSubmit?: () => void;
};

const AddMissingMessageKeyModal = ({
  id,
  context,
  innerProps,
}: ContextModalProps<Props>) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const [isLoading, setIsLoading] = useState(false);

  const isEmpty = icuEditorStore.use.isEmpty();
  const clearStore = icuEditorStore.use.actions().clearStore;
  const editorInstance = icuEditorStore.use.editorInstance();

  useEffect(() => {
    return () => {
      clearStore();
    };
  }, [clearStore]);

  const handleSubmit = async () => {
    if (isEmpty || !editorInstance) {
      return;
    }
    setIsLoading(true);

    const [error] = await attemptAsync(async () => {
      const filePath = innerProps.namespace.path;
      const content = await readJsonFileSafe(filePath);
      const textContent = editorInstance.getText();

      set(content, innerProps.initialKey, textContent);

      await writeTextFile(filePath, JSON.stringify(content, null, 2));
    });

    if (error) {
      setIsLoading(false);
      return notifications.show({
        title: tCommon('errors.unexpectedError.title'),
        message: tCommon('errors.unexpectedError.message'),
      });
    }

    innerProps.onSubmit?.();
    setIsLoading(false);
    return context.closeModal(id);
  };

  return (
    <Stack>
      <TextInput
        readOnly
        ff="monospace"
        value={innerProps.initialKey}
        label={t('localesTab.missingKeysTable.table.key')}
      />

      <Text
        size="sm"
        c="dimmed"
        ff="monospace"
        style={{ cursor: 'pointer' }}

        onClick={async () =>
          attemptAsync(async () => revealItemInDir(innerProps.namespace.path))}
      >
        {innerProps.namespace.path}
      </Text>

      <ICUEditor />

      <Group justify="flex-end">
        <Button
          variant="default"
          disabled={isLoading}

          onClick={() => context.closeModal(id)}
        >
          {tCommon('cancel')}
        </Button>
        <Button
          disabled={isEmpty}
          loading={isLoading}

          onClick={handleSubmit}
        >
          {tCommon('save')}
        </Button>
      </Group>
    </Stack>
  );
};

export default AddMissingMessageKeyModal;
