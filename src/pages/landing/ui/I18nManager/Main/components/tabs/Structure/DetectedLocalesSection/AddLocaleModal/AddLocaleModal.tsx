// components/modals/AddLocaleModal.tsx
import { IconPlus, IconFolder, IconFileText } from '@tabler/icons-react';
import { Box, Text, Group, Modal, Stack, Button, Select, Divider, ScrollArea } from '@mantine/core';

import { useHandleAddLocaleModal } from './useHandleAddLocaleModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type ProjectData = NonNullable<I18nManagerStore['selectedProjectData']>;

type Props = {
  projectData: ProjectData;
  onSuccess?: (locale: string) => void;
};

export const AddLocaleModal = (params: Props) => {
  const handlers = useHandleAddLocaleModal(params);

  const {
    t,
    form,
    openModal,
    isLoading,
    openedModal,
    handleClose,
    handleSubmit,
    previewFiles,
    normalizedCode,
    availableLocaleOptions,
  } = handlers;

  return (
    <>
      <Button
        size="xs"
        variant="default"
        leftSection={<IconPlus size={12} />}
        styles={{ root: { borderStyle: 'dashed' } }}

        onClick={openModal}
      >
        {t('structure.addLocale')}
      </Button>

      <Modal
        centered
        size="lg"
        opened={openedModal}
        title={t('structure.modals.addLocale.title')}

        onClose={handleClose}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              {t('structure.modals.addLocale.description')}
            </Text>

            <Select
              searchable
              withAsterisk
              data={availableLocaleOptions}
              label={t('structure.modals.addLocale.codeLabel')}
              placeholder={t('structure.modals.addLocale.codePlaceholder')}
              nothingFoundMessage={t('structure.modals.addLocale.noResults')}
              {...form.getInputProps('localeCode')}
            />

            {normalizedCode && !form.errors['localeCode'] && (
              <>
                <Divider
                  labelPosition="left"
                  label={t('structure.modals.addLocale.previewLabel')}
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
                    <IconFolder size={14} color="var(--mantine-color-yellow-6)" />
                    <Text fw={500} size="sm">
                      {normalizedCode}
                    </Text>
                  </Group>

                  <ScrollArea.Autosize mah={180}>
                    <Stack gap={4} pl="md">
                      {previewFiles.map(ns => (
                        <Group gap={6} key={ns} wrap="nowrap">
                          <IconFileText
                            size={12}
                            color="var(--mantine-color-blue-6)"
                          />
                          <Text size="xs">{ns}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>

                  <Text mt="xs" size="xs" c="dimmed">
                    {t('structure.modals.addLocale.previewTotal', {
                      count: previewFiles.length,
                    })}
                  </Text>
                </Box>
              </>
            )}

            <Group mt="xs" gap="xs" justify="flex-end">
              <Button
                variant="default"
                disabled={isLoading}

                onClick={handleClose}
              >
                {t('structure.modals.addLocale.cancel')}
              </Button>
              <Button type="submit" loading={isLoading}>
                {t('structure.modals.addLocale.submit')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
