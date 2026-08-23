import { jsonrepair } from 'jsonrepair';
import { useField } from '@mantine/form';
import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { IconCodeDots } from '@tabler/icons-react';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { Stack, Button, Popover, JsonInput, CloseButton } from '@mantine/core';

const normalizeValue = (value: string) => {
  let incomingValue = value;
  if (value[0] !== '{' && value.includes(':')) {
    incomingValue = `{${value}`;
  }

  return incomingValue;
};

const JSONPropertyPasteControl = () => {
  const t = useTranslations('editor');
  const { editor } = useRichTextEditorContext();
  const field = useField({
    initialValue: '',
    validateOnChange: false,
  });
  const [opened, handlers] = useDisclosure(false);

  const handleSubmit = () => {
    try {
      const normalizedValue = normalizeValue(field.getValue());
      const repaired = jsonrepair(normalizedValue);
      const parsedMessage = JSON.parse(repaired);

      if (typeof parsedMessage === 'string') {
        editor?.commands.setContent(parsedMessage);
      }

      if (typeof parsedMessage === 'object') {
        const firstProperty = Object.entries(parsedMessage as object)?.[0]?.[1];
        editor?.commands.setContent(String(firstProperty));
      }

      handlers.close();
    } catch (e) {
      void e;
      field.setError('The entered value is too large and invalid.');
    }
  };

  const handleClear = () => {
    field.reset();
  };

  return (

    <Popover
      withArrow
      width={300}
      shadow="md"
      opened={opened}
      position="bottom"

      onChange={handlers.set}
      onExitTransitionEnd={field.reset}
    >
      <Popover.Target>
        <RichTextEditor.Control
          title={t('controls.jsonPropertyPaste')}
          aria-label={t('controls.jsonPropertyPaste')}

          onClick={handlers.open}
        >
          <IconCodeDots size={16} />
        </RichTextEditor.Control>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Stack gap="xs">
          <JsonInput
            autosize
            minRows={4}
            validationError={field.error}
            placeholder={t('controls.jsonPastePlaceholder')}
            rightSection={<CloseButton onClick={handleClear} />}
            {...field.getInputProps({ withFocus: false })}
          />
          <Button
            tt="capitalize"
            size="compact-sm"
            disabled={!!field.error}

            onClick={handleSubmit}
          >
            {'add'}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default JSONPropertyPasteControl;
