import { IconPlus } from '@tabler/icons-react';
import { Box, Text, Modal, SimpleGrid, ActionIcon } from '@mantine/core';

import { ProjectBasicInfo } from './ProjectBasicInfo';
import { StructureDetection } from './StructureDetection';
import { ProjectModalFooter } from './ProjectModalFooter';
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

        onClose={h.modalHandlers.close}
      >
        <SimpleGrid spacing="xl" cols={{ md: 2, base: 1 }}>
          <ProjectBasicInfo form={h.form} />

          <StructureDetection
            form={h.form}

            onStructureSelect={h.handleStructureSelect}
          />
        </SimpleGrid>

        <ProjectModalFooter
          cancelLabel={h.tCommon('cancel')}
          submitLabel={h.t('createNewProject.submit')}

          onCancel={h.modalHandlers.close}
          onSubmit={() => h.form.onSubmit(h.handleCreateProject)()}
        />
      </Modal>
    </>
  );
};
