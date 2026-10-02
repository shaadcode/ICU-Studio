import { Menu } from '@mantine/core';
import { useTranslations } from 'use-intl';
import type { MarkViewRendererProps } from '@tiptap/react';

import { getMarkViewAttributes } from '@/shared/lib/icu';
import { getDelimiterRange } from '../../../getDelimiterRange';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';
import { useFormatMessage } from '@/pages/landing/ui/Editor/useFormatMessage';

type Props = {
  tiptapMark: MarkViewRendererProps;
};

const ConvertVariableAction = (props: Props) => {
  const { editor } = props.tiptapMark;
  const formatHandlers = useFormatMessage({ editor });
  const t = useTranslations('editor');
  const attrs = getMarkViewAttributes(props.tiptapMark);

  const handleConvert = (targetVariable: MessageElementsTypeKeyword) => {
    const referenceId = attrs['data-reference-id'];
    const messageRange = getDelimiterRange({ editor, referenceId });
    const from = messageRange?.open?.from;
    const to = messageRange?.close?.to;

    if (!from || !to) {
      return;
    }

    let convertedMessage = '';
    editor.state.doc.descendants((node) => {
      if (node.marks[0]?.attrs['data-reference-id'] === referenceId) {
        const variableName = node.text;
        if (targetVariable === 'date') {
          convertedMessage = `{ ${variableName} , date}`;
        }
        if (targetVariable === 'argument') {
          convertedMessage = `{ ${variableName} }`;
        }
        if (targetVariable === 'time') {
          convertedMessage = `{ ${variableName} , time}`;
        }
        if (targetVariable === 'number') {
          convertedMessage = `{ ${variableName} , number}`;
        }
      }
    });

    const result = editor
      .chain()
      .insertContentAt({ to, from }, convertedMessage)
      .run();

    if (result) {
      formatHandlers.formatMessage();
    }
  };

  if (
    attrs['data-variable-type'] === 'plural'
    || attrs['data-variable-type'] === 'select'
    || attrs['data-variable-type'] === 'literal'
    || attrs['data-variable-type'] === 'tag'
    || attrs['data-variable-type'] === 'pound'
  ) {
    return null;
  }

  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        <Menu.Sub.Item>{t('convertTo')}</Menu.Sub.Item>
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        <Menu.Item
          display={attrs['data-variable-type'] === 'argument' ? 'none' : undefined}

          onClick={() => handleConvert('argument')}
        >
          {t('controls.snippets.simpleVariable')}
        </Menu.Item>
        <Menu.Item
          display={attrs['data-variable-type'] === 'number' ? 'none' : undefined}

          onClick={() => handleConvert('number')}
        >
          {t('controls.snippets.number')}
        </Menu.Item>
        <Menu.Item
          display={attrs['data-variable-type'] === 'date' ? 'none' : undefined}

          onClick={() => handleConvert('date')}
        >
          {t('controls.snippets.date')}
        </Menu.Item>
        <Menu.Item
          display={attrs['data-variable-type'] === 'time' ? 'none' : undefined}

          onClick={() => handleConvert('time')}
        >
          {t('controls.snippets.time')}
        </Menu.Item>
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  );
};

export default ConvertVariableAction;
