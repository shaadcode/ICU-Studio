import { IconPlus, IconFilePlus, IconFileImport } from '@tabler/icons-react';
import { Menu, Stack, Drawer, Button, TextInput, ActionIcon } from '@mantine/core';

import { useCreateMessageHandlers } from './useCreateMessageHandlers';

export type MessageStoreSchema = {
  name: string;
  dirPath: string;
};

const CreateMessageFile = () => {
  const handlers = useCreateMessageHandlers();

  return (
    <>
      <Menu shadow="md" width={220} position="bottom-end">
        <Menu.Target>
          <ActionIcon
            size="md"
            variant="default"
            style={{ boxShadow: 'none' }}
          >
            <IconPlus size="80%" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{handlers.t('newMessageFile')}</Menu.Label>

          <Menu.Item
            leftSection={<IconFilePlus size={16} />}

            onClick={handlers.openCreateMode}
          >
            {handlers.t('createNewFile')}
          </Menu.Item>

          <Menu.Item
            leftSection={<IconFileImport size={16} />}

            onClick={handlers.handleOpenExistFile}
          >
            {handlers.t('openExistingFile')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Drawer
        opened={handlers.opened}

        onClose={handlers.drawerHandlers.close}
      >
        <form onSubmit={handlers.form.onSubmit(handlers.handleCreateNewFile)}>
          <Stack>
            <TextInput
              tt="capitalize"
              placeholder={handlers.tCommon('github')}
              label={`${handlers.t('messageFileName')}`}
              {...handlers.form.getInputProps('name')}
            />

            <Button type="submit" tt="capitalize" loading={handlers.form.submitting}>
              {handlers.tCommon('add')}
            </Button>
          </Stack>
        </form>
      </Drawer>
    </>
  );
};

export default CreateMessageFile;
