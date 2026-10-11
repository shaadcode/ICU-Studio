import { memo } from 'react';
import { forEachRight } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { IconTrash } from '@tabler/icons-react';
import { Tooltip, ActionIcon } from '@mantine/core';

import { getDelimiterRange } from '@/shared/lib/tiptap';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  editor: Editor;
  referenceIds: string[];
  onDeleted: (deletedItems: Array<string>) => void;
};

export const DeleteAllButton = memo((props: Props) => {
  const t = useTranslations('common');
  const editor = icuEditorStore.use.editorInstance();
  const formatContent = icuEditorStore.use.actions().formatContent;

  const handleDelete = () => {
    if (!editor || props.referenceIds.length === 0) {
      return;
    }

    const ranges: Array<{ to: number; from: number }> = [];

    editor.state.doc.descendants((node) => {
      if (!node.isText) {
        return true;
      }

      const refId = node.marks.find(m => m.attrs['data-reference-id'])?.attrs['data-reference-id'];

      if (refId && props.referenceIds.includes(refId)) {
        const variableRanges = getDelimiterRange({ editor: props.editor, referenceId: refId as string });
        ranges.push({
          to: variableRanges.close.to,
          from: variableRanges.open.from,
        });
      }
      return true;
    });

    if (!ranges.length || ranges.length !== props.referenceIds.length) {
      return;
    }

    const chain = editor.chain().setMeta('skipUpdate', true);
    forEachRight(ranges, range => chain.deleteRange({ to: range.to, from: range.from }));
    chain.run();
    formatContent({ editor });
    props.onDeleted(props.referenceIds);
  };

  return (
    <Tooltip label={t('deleteAll')}>
      <ActionIcon
        size="sm"
        color="red"
        variant="light"
        aria-label={t('deleteAll')}

        onClick={handleDelete}
      >
        <IconTrash size={14} />
      </ActionIcon>
    </Tooltip>
  );
});

DeleteAllButton.displayName = 'DeleteAllButton';
