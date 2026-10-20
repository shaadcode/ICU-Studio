import { IconPlus } from '@tabler/icons-react';
import { Box, Text, Modal, Group, Button, SimpleGrid, ActionIcon } from '@mantine/core';

import { ProjectBasicInfo } from './ProjectBasicInfo';
import { StructureDetection } from './StructureDetection';
import { useCreateProjectHandlers } from './useCreateProjectHandlers';

export const CreateNewProject = () => {
  const h = useCreateProjectHandlers();

  return (
    <>
      <ActionIcon
        size="md"
        variant="default"
        style={{ boxShadow: 'none' }}

        onClick={h.modalHandlers.open}
      >
        <IconPlus size="80%" />
      </ActionIcon>

      <Modal
        centered
        size="90%"
        opened={h.opened}
        title={(
          <Box>
            <Text fw={600} size="lg">
              {h.t('createNewProject.title')}
            </Text>
            <Text size="sm" c="dimmed">
              {h.t('createNewProject.subtitle')}
            </Text>
          </Box>
        )}

        onExitTransitionEnd={h.form.reset}
        onClose={() => {
          if (!h.form.submitting) {
            h.modalHandlers.close();
          }
        }}
      >
        <SimpleGrid spacing="xl" cols={{ md: 2, base: 1 }}>
          <ProjectBasicInfo form={h.form} setHasLocale={h.setHasLocale} />

          <StructureDetection form={h.form} />
        </SimpleGrid>

        <Group mt="xl" justify="flex-end">
          <Button
            variant="default"
            disabled={h.form.submitting}

            onClick={h.modalHandlers.close}
          >
            {h.tCommon('cancel')}
          </Button>
          <Button
            loading={h.form.submitting}
            disabled={!h.form.isValid()}

            onClick={() => h.form.onSubmit(h.handleCreateProject)()}
          >
            {h.t('createNewProject.submit')}
          </Button>
        </Group>
      </Modal>
    </>
  );
};
