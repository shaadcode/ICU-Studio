import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Box, Code, Text, Group, Stack } from '@mantine/core';

import classes from './CodeSnippet.module.css';
import type { ICUEditorStore } from '@/pages/landing/config/store/editor';
import { generateErrorCodeSnippet } from '../../../ValidationErrorBubble/generateErrorCodeSnippet';

type Props = {
  editor: Editor;
  errorLocation: NonNullable<ICUEditorStore['errorLocation']>;
  validationError: NonNullable<ICUEditorStore['validationError']>;
};

const CodeSnippet = (props: Props) => {
  const t = useTranslations('editor');

  const codeSnippet = generateErrorCodeSnippet(props);

  const startLine = props.validationError.location.start?.line;
  const endLine = props.validationError.location.end.line;
  const startColumn = props.validationError.location.start?.column;
  const endColumn = props.validationError.location.end?.column;

  const formatRange = (start?: number, end?: number) => {
    if (start === undefined || end === undefined) {
      return '';
    }
    if (start === end) {
      return String(start);
    }
    return `${start},${end}`;
  };

  const lineRange = formatRange(startLine, endLine);
  const columnRange = formatRange(startColumn, endColumn);

  return (
    <Stack gap={6}>
      {/* Line info */}
      <Group gap={6} c="dimmed">
        <IconInfoCircle size={14} />
        <Text size="xs">
          {t('validation.lineNumber', { number: lineRange })}
          {'  -  '}
          {t('validation.columnNumber', { number: columnRange })}
        </Text>
      </Group>

      {/* Code block */}
      <Box className={classes['codeBlock']}>
        <Code block className={classes['codeInner']}>
          {codeSnippet}
        </Code>
      </Box>
    </Stack>
  );
};

export default CodeSnippet;
