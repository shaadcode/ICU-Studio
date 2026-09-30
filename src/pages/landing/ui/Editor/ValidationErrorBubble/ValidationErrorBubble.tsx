import { useTranslations } from 'use-intl';
import type { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Box, Text, Code, Group, Stack, Button, Popover, ActionIcon, CloseButton } from '@mantine/core';
import {
  IconInfoCircle,
  IconDotsVertical,
  IconMessageChatbot,
  IconAlertSquareRounded,
  IconAlertSquareRoundedFilled,
} from '@tabler/icons-react';

import { FixButton } from './FixButton/FixButton';
import classes from './ValidationErrorBubble.module.css';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import { generateErrorCodeSnippet } from './generateErrorCodeSnippet';

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
  const [opened, { open, close }] = useDisclosure(false);
  const errorLocation = icuEditorStore.use.errorLocation();
  const validationError = icuEditorStore.use.validationError();
  const clearValidationError = icuEditorStore.use.actions().clearValidationError;

  const [coords, setCoords] = useState<null | {
    end: Coords;
    start: Coords;
  }>(null);

  const updateCoords = (editor: Editor) => {
    if (errorLocation && validationError?.location.end.line === validationError?.location.start.line) {
      const start = editor.view.coordsAtPos(errorLocation.lineRangeOffset.start);
      const end = editor.view.coordsAtPos(errorLocation.lineRangeOffset.end);
      setCoords({ end, start });
    } else if (errorLocation?.end && errorLocation?.start) {
      const start = editor.view.coordsAtPos(errorLocation.start);
      const end = editor.view.coordsAtPos(errorLocation.end);
      setCoords({ end, start });
    }
  };

  const handleFixed = () => {
    clearValidationError();
    close();
  };

  useEffect(() => {
    if (errorLocation && editor) {
      updateCoords(editor);
    }
  }, [errorLocation, editor]);

  if (!editor || !validationError || !errorLocation || !coords) {
    return null;
  }
  console.log(errorLocation);
  console.log(validationError.location);
  const codeSnippet = generateErrorCodeSnippet({ editor, errorLocation, validationError });

  return (
    <>
      <Group
        mih={22}
        className={classes['BubbleRoot']}
        style={{ top: coords.start.top - 70 }}
        h={coords.start.top - coords.end.bottom}
      />

      <Popover
        offset={0}
        shadow="xs"
        opened={opened}
        closeOnClickOutside
        position="bottom-end"

        onClose={close}
      >
        <Popover.Target>
          <ActionIcon
            size="sm"
            pos="absolute"
            variant="transparent"
            className={classes['errorIcon']}
            style={{ top: coords.start.top - 70 }}

            onClick={open}
          >
            <IconAlertSquareRoundedFilled color="red" />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown className={classes['errorPopover']}>
          <Stack>
            {/* Header */}
            <Group wrap="nowrap" justify="space-between">
              <Group gap="xs" wrap="nowrap">
                <IconAlertSquareRounded size={18} color="var(--mantine-color-red-6)" />
                <Text fw={600} c="red.7" tt="capitalize">{t('validation.syntaxError')}</Text>

              </Group>

              <CloseButton onClick={close} />
            </Group>
            {/* Message */}
            <Text size="sm">
              {t(`parsingErrors.${validationError.message}`)}
            </Text>

            <Stack gap={6}>
              {/* Line info */}
              <Group gap={6} c="dimmed">
                <IconInfoCircle size={14} />
                <Text size="xs">
                  {t('validation.lineNumber', {
                    number: `${validationError.location.start?.line},${validationError.location.end.line}`,
                  })}
                  {'  -  '}
                  {t('validation.columnNumber', {
                    number: `${validationError.location.end?.column},${validationError.location.end?.column}`,
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

            {/* Actions */}
            <Group wrap="nowrap">
              <FixButton
                context={{
                  editor,
                  errorLocation,
                  rawMessage: editor?.state.doc.textContent ?? '',
                }}

                onFixed={handleFixed}
              />
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
              <ActionIcon size="sm" ms="auto" radius={5} variant="subtle">
                <IconDotsVertical size="80%" />
              </ActionIcon>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </>
  );
};

export default ValidationErrorBubble;
