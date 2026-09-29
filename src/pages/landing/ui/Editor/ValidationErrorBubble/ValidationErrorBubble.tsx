import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Box, Text, Code, Group, Button, Popover } from '@mantine/core';
import {
  IconWand,
  IconInfoCircle,
  IconDotsVertical,
  IconMessageChatbot,
  IconAlertSquareRounded,
  IconAlertSquareRoundedFilled,
} from '@tabler/icons-react';

import classes from './ValidationErrorBubble.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  editor: null | Editor;
};

type Coords = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

const ValidationErrorBubble = ({ editor }: Props) => {
  const t = useTranslations('editor');
  const errorLocation = icuEditorStore.use.errorLocation();
  const validationError = icuEditorStore.use.validationError();
  const [coords, setCoords] = useState<null | {
    end: Coords;
    start: Coords;
  }>(null);
  const [opened, setOpened] = useState(false);

  const updateCoords = (editor: Editor) => {
    if (errorLocation?.lineRange) {
      const start = editor.view.coordsAtPos(errorLocation.lineRange.start);
      const end = editor.view.coordsAtPos(errorLocation.lineRange.end);
      setCoords({ end, start });
    }
  };

  useEffect(() => {
    if (errorLocation && editor) {
      updateCoords(editor);
    }
  }, [errorLocation, editor]);

  if (!validationError || !errorLocation || !coords) {
    return null;
  }

  const codeSnippet = editor?.state.doc.textBetween(errorLocation.lineRange!.start, errorLocation.lineRange!.end);

  return (
    <>
      <Group
        className={classes['BubbleRoot']}
        style={{ top: coords.start.top - 70 }}
      />

      <Popover
        offset={8}
        shadow="md"
        withinPortal
        opened={opened}
        withArrow={false}
        trapFocus={false}
        closeOnClickOutside
        position="bottom-start"

        onChange={setOpened}
      >
        <Popover.Target>
          <IconAlertSquareRoundedFilled
            color="red"
            className={classes['errorIcon']}
            style={{ top: coords.start.top - 67 }}

            onClick={() => setOpened(o => !o)}
          />
        </Popover.Target>

        <Popover.Dropdown p="md" className={classes['errorPopover']}>
          {/* Header */}
          <Group mb="xs" gap="xs" wrap="nowrap">
            <IconAlertSquareRounded size={18} color="var(--mantine-color-red-6)" />
            <Text fw={600} c="red.7" tt="capitalize">{t('validation.syntaxError')}</Text>
          </Group>

          {/* Message */}
          <Text mb="xs" size="sm">
            {t(`parsingErrors.${validationError.message}`)}
          </Text>

          {/* Line info */}
          <Group gap={6} mb="sm" c="dimmed">
            <IconInfoCircle size={14} />
            <Text size="xs">
              {t('validation.lineNumber', { number: errorLocation.lineNumber ?? '' })}
              {', '}
              {t('validation.columnNumber', {
                number: `${errorLocation.end?.column},${errorLocation.end?.column}`,
              })}
            </Text>
          </Group>

          {/* Code block */}
          <Box mb="md" className={classes['codeBlock']}>
            <Code block className={classes['codeInner']}>
              {codeSnippet}
            </Code>
          </Box>

          {/* Actions */}
          <Group gap="xs" wrap="nowrap">
            <Button
              size="xs"
              color="red"
              leftSection={<IconWand size={14} />}

              onClick={() => {
                // TODO: auto fix
                setOpened(false);
                console.log();
              }}
            >
              {'Fix automatically\r'}
            </Button>
            <Button
              size="xs"
              variant="default"
              leftSection={<IconMessageChatbot size={14} />}

              onClick={() => {
                // TODO: explain
              }}
            >
              {'Explain\r'}
            </Button>
            <Button px={6} size="xs" ml="auto" variant="subtle">
              <IconDotsVertical size={16} />
            </Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </>
  );
};

export default ValidationErrorBubble;
