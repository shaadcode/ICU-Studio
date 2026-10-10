import { memo } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Center } from '@mantine/core';

export const EditorNotReadyState = memo(() => {
  const tEditor = useTranslations('editor');

  return (
    <Center style={{ flex: 1 }}>
      <Text size="sm" c="dimmed" ta="center" textWrap="wrap">
        {tEditor('widgets.problems.editorNotReady')}
      </Text>
    </Center>
  );
});

EditorNotReadyState.displayName = 'EditorNotReadyState';
