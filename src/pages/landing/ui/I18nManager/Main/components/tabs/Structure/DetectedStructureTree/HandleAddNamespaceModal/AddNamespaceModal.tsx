import type { ComponentProps } from 'react';
// components/modals/AddNamespaceModal.tsx
import { IconPlus, IconFolder, IconFileText } from '@tabler/icons-react';
import { Box, Text, Group, Modal, Stack, Button, Divider, Tooltip, TextInput, ScrollArea } from '@mantine/core';

import { useHandleAddNamespaceModal } from './useHandleAddNamespaceModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type ProjectData = NonNullable<I18nManagerStore['selectedProjectData']>;

type Props = {
  projectData: ProjectData;
  onSuccess?: (namespace: string) => void;
  buttonProps?: ComponentProps<typeof Button<'button'>>;
};

export const AddNamespaceModal = (params: Props) => {
  const {
    t,
    form,
    openModal,
    openedModal,
    handleClose,
    handleSubmit,
    normalizedName,
  } = useHandleAddNamespaceModal(params);

  const hasLocales = params.projectData.locales.length > 0;

  return (
    <>
      <Tooltip
        fz="xs"
        withArrow
        position="bottom"
        disabled={hasLocales}
        label={t('structure.addNamespaceDisabledTooltip')}
      >
        <Button
          size="xs"
          variant="filled"
          disabled={!hasLocales}
          leftSection={<IconPlus size={14} />}

          onClick={openModal}
          {...params.buttonProps}
        >
          {t('structure.addNamespace')}
        </Button>
      </Tooltip>

      <Modal
        centered
        size="md"
        opened={openedModal}
        title={t('structure.modals.addNamespace.title')}

        onClose={handleClose}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              {t('structure.modals.addNamespace.description')}
            </Text>

            <TextInput
              withAsterisk
              data-autofocus
              label={t('structure.modals.addNamespace.nameLabel')}
              placeholder={t('structure.modals.addNamespace.namePlaceholder')}
              {...form.getInputProps('namespaceName')}
            />

            {normalizedName && !form.errors['namespaceName'] && (
              <>
                <Divider
                  labelPosition="left"
                  label={t('structure.modals.addNamespace.previewLabel')}
                />

                <Box
                  p="sm"
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                    background: 'var(--mantine-color-default-hover)',
                    border: '1px solid var(--mantine-color-default-border)',
                  }}
                >
                  <Group gap={6} mb="xs" wrap="nowrap">
                    <IconFileText size={14} color="var(--mantine-color-blue-6)" />
                    <Text fw={500} size="sm">
                      {normalizedName}
                      {'.json'}
                    </Text>
                  </Group>

                  <ScrollArea.Autosize mah={150}>
                    <Stack gap={4} pl="md">
                      {params.projectData.locales.map(locale => (
                        <Group gap={6} wrap="nowrap" key={locale.language.code}>
                          <IconFolder
                            size={12}
                            color="var(--mantine-color-yellow-6)"
                          />
                          <Text size="xs">{locale.language.code}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>

                  <Text mt="xs" size="xs" c="dimmed">
                    {t('structure.modals.addNamespace.previewTotal', {
                      count: params.projectData.locales.length,
                    })}
                  </Text>
                </Box>
              </>
            )}

            <Group mt="xs" gap="xs" justify="flex-end">
              <Button
                variant="default"
                disabled={form.submitting}

                onClick={handleClose}
              >
                {t('structure.modals.addLocale.cancel')}
              </Button>
              <Button type="submit" loading={form.submitting}>
                {t('structure.modals.addNamespace.submit')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
