import { Menu } from '@mantine/core';
import { useTranslations } from 'use-intl';

import type { SharedActionProps } from '../../VariableActions';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';
import { getDelimiterRange } from '../../../../../tiptap/getDelimiterRange';

const ConvertVariableAction = (props: SharedActionProps) => {
  const formatContent = icuEditorStore.use.actions().formatContent;
  const t = useTranslations('editor');

  const handleConvert = (targetVariable: MessageElementsTypeKeyword) => {
    const messageRange = getDelimiterRange({
      editor: props.editor,
      referenceId: props.referenceId,
    });
    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;

    if (!from || !to) {
      return;
    }

    let variableName = '';
    props.editor.state.doc.descendants((node) => {
      if (node.marks[0]?.attrs['data-reference-id'] === props.referenceId) {
        variableName = node.text!;
      }
    });

    if (!variableName) {
      return;
    }

    const convertedMessage = buildConvertedMessage(variableName, targetVariable);
    if (!convertedMessage) {
      return;
    }

    props.editor
      .chain()
      .setMeta('skipUpdate', true)
      .insertContentAt({ to, from }, convertedMessage)
      .run();

    formatContent({ editor: props.editor });
  };

  if (
    props.elementType === 'literal'
    || props.elementType === 'pound'
    || props.elementType === 'tag'
  ) {
    return null;
  }

  const convertTargets: Array<{
    label: string;
    value: MessageElementsTypeKeyword;
  }> = [
    { value: 'argument', label: t('controls.snippets.simpleVariable') },
    { value: 'number', label: t('controls.snippets.number') },
    { value: 'date', label: t('controls.snippets.date') },
    { value: 'time', label: t('controls.snippets.time') },
    { value: 'plural', label: t('controls.snippets.plural') },
    { value: 'select', label: t('controls.snippets.select') },
    { value: 'selectordinal', label: t('controls.snippets.selectordinal') },
  ];

  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        <Menu.Sub.Item
          tt="capitalize"
          style={{ textWrap: 'nowrap' }}
        >
          {t('convertTo')}
        </Menu.Sub.Item>
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        {convertTargets
          .filter(target => target.value !== props.elementType)
          .map(target => (
            <Menu.Item
              key={target.value}

              onClick={() => handleConvert(target.value)}
            >
              {target.label}
            </Menu.Item>
          ))}
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  );
};

export default ConvertVariableAction;

function buildConvertedMessage(
  name: string,
  target: MessageElementsTypeKeyword,
): null | string {
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
      return `{${name}, select, option1 {} other {}}`;
    case 'selectordinal':
      return `{${name}, selectordinal, one {#} two {#} few {#} other {#}}`;
    default:
      return null;
  }
}
