// Widgets/Variables/ConvertAllToButton.tsx
import { memo } from 'react';
import { forEachRight } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { IconTransform } from '@tabler/icons-react';
import { Menu, Tooltip, ActionIcon } from '@mantine/core';

import { getDelimiterRange } from '@/shared/lib/tiptap';
import type { MessageKeys } from '@/shared/config/reactI18n/types';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';

type Props = {
  editor: Editor;
  referenceIds: string[];
  onConverted?: (convertedIds: string[], target: MessageElementsTypeKeyword) => void;
};

const CONVERT_TARGETS = [
  { value: 'argument', labelKey: 'controls.snippets.simpleVariable' },
  { value: 'number', labelKey: 'controls.snippets.number' },
  { value: 'date', labelKey: 'controls.snippets.date' },
  { value: 'time', labelKey: 'controls.snippets.time' },
  { value: 'plural', labelKey: 'controls.snippets.plural' },
  { value: 'select', labelKey: 'controls.snippets.select' },
  { value: 'selectordinal', labelKey: 'controls.snippets.selectordinal' },
] as const satisfies Array<{
  labelKey: MessageKeys<'editor'>;
  value: MessageElementsTypeKeyword;
}>;

export const ConvertAllToButton = memo((props: Props) => {
  const t = useTranslations('editor');
  const editor = icuEditorStore.use.editorInstance();
  const formatContent = icuEditorStore.use.actions().formatContent;

  const handleConvert = (target: MessageElementsTypeKeyword) => {
    if (!editor || props.referenceIds.length === 0) {
      return;
    }

    const chain = editor.chain().setMeta('skipUpdate', true);
    forEachRight(
      editor.$node('paragraph')?.children ?? [],
      (child) => {
        const refId = child.node.marks[0]?.attrs['data-reference-id'];

        if (refId && props.referenceIds.includes(refId)) {
          const converted = buildConvertedMessage(child.textContent, target);

          const variableRanges = getDelimiterRange({
            editor: props.editor,
            referenceId: refId as string,
          });
          chain.insertContentAt(
            { to: variableRanges.close.to, from: variableRanges.open.from },
            converted,
            {},
          );
        }
      },
    );

    chain.run();
    formatContent({ editor });
    props.onConverted?.(props.referenceIds, target);
  };

  return (
    <Menu shadow="md" width={200} withinPortal position="bottom-end">
      <Menu.Target>
        <Tooltip label={t('convertAllTo')}>
          <ActionIcon
            size="sm"
            color="blue"
            variant="light"
            aria-label={t('convertAllTo')}
          >
            <IconTransform size={14} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('convertTo')}</Menu.Label>
        {CONVERT_TARGETS.map(target => (
          <Menu.Item
            key={target.value}

            onClick={() => handleConvert(target.value)}
          >
            {t(target.labelKey)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
});

ConvertAllToButton.displayName = 'ConvertAllToButton';

/**
 * ساخت پیام ICU بر اساس نوع هدف
 */
function buildConvertedMessage(
  name: string,
  target: MessageElementsTypeKeyword,
): string {
  switch (target) {
    case 'argument':
      return `{${name}}`;
    case 'number':
      return `{${name}, number}`;
    case 'date':
      return `{${name}, date}`;
    case 'time':
      return `{${name}, time}`;
    case 'plural':
      return `{${name}, plural, one {#} other {#}}`;
    case 'select':
      return `{${name}, select, male {} female {} other {}}`;
    case 'selectordinal':
      return `{${name}, selectordinal, one {#} two {#} few {#} other {#}}`;
    default:
      return `{${name}}`;
  }
}
