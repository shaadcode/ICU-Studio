import { useTranslations } from 'use-intl';
// OutlineWidget.tsx
import { memo, useMemo, useCallback } from 'react';
import { IconListTree } from '@tabler/icons-react';
import { Stack, Badge, ScrollAreaAutosize } from '@mantine/core';

import { OutlineItem } from './OutlineItem';
import WidgetHeader from '../../../WidgetHeader';
import type { OutlineNode } from './buildOutlineTree';
import { buildOutlineTree } from './buildOutlineTree';
import { OutlineEmptyState } from './OutlineEmptyState';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import WidgetContainer from '../../../WidgetContainer/WidgetContainer';

export const OutlineWidget = memo(() => {
  const t = useTranslations('editor');
  const parsedMessage = icuEditorStore.use.parsedMessage();
  const textContent = icuEditorStore.use.textContent();
  const editor = icuEditorStore.use.editorInstance();

  const tree = useMemo(() => {
    if (!parsedMessage?.length) {
      return [];
    }
    return buildOutlineTree(parsedMessage, textContent);
  }, [parsedMessage, textContent]);

  const isEmpty = tree.length === 0;

  const handleSelect = useCallback((node: OutlineNode) => {
    if (!editor || !node.location) {
      return;
    }

    editor
      .chain()
      .focus()
      .setTextSelection({ to: node.location.end, from: node.location.start })
      .scrollIntoView()
      .run();
  }, [editor]);

  return (
    <WidgetContainer>
      <Stack h="100%" gap="xs">
        <WidgetHeader
          label={t('widgets.outline.title')}
          icon={props => (
            <IconListTree color="var(--mantine-color-teal-6)" {...props} />
          )}
          endSection={(
            <Badge size="sm" color="teal" variant="light">
              {tree.length}
            </Badge>
          )}
        />

        {isEmpty
          ? (
              <OutlineEmptyState />
            )
          : (
              <ScrollAreaAutosize mih={0} mah="100%" offsetScrollbars>
                <Stack gap={2}>
                  {tree.map(node => (
                    <OutlineItem
                      node={node}
                      key={node.id}

                      onSelect={handleSelect}
                    />
                  ))}
                </Stack>
              </ScrollAreaAutosize>
            )}
      </Stack>
    </WidgetContainer>
  );
});

OutlineWidget.displayName = 'OutlineWidget';
