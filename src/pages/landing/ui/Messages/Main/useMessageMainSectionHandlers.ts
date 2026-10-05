import { useEditor } from '@tiptap/react';
import { useTranslations } from 'use-intl';
import { useHotkeys } from '@mantine/hooks';

import { appStore } from '@/pages/landing/config/store/app';
import { defaultICUEditorConfig } from '@/shared/lib/tiptap';

export function useMessageMainSectionHandlers() {
  const content = appStore.use.messageContent();
  const t = useTranslations('editor');
  const handleSaveMessage = () => {

  };

  const editor = useEditor({
    ...defaultICUEditorConfig({ placeholder: t('placeholder') }),
  });

  useHotkeys([
    ['mod+S', () => {}],
  ]);

  return {
    editor,
    content,
  };
}
