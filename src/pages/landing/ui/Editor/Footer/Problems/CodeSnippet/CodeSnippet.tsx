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

  return (
    <Stack gap={6}>
      {/* Line info */}
      <Group gap={6} c="dimmed">
        <IconInfoCircle size={14} />
        <Text size="xs">
          {t('validation.lineNumber', {
            number: `${props.validationError.location.start?.line},${props.validationError.location.end.line}`,
          })}
          {'  -  '}
          {t('validation.columnNumber', {
            number: `${props.validationError.location.end?.column},${props.validationError.location.end?.column}`,
          })}
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
