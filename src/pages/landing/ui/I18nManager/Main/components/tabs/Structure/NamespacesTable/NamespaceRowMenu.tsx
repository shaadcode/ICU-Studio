import { useDisclosure } from '@mantine/hooks';
import { Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import { DeleteNamespaceMenuItem } from './menu-items/DeleteNamespaceMenuItem';

type Props = {
  projectData: Project;
  namespace: Project['namespaces'][number];
};

export const NamespaceRowMenu = ({ namespace, projectData }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Menu
      withArrow
      shadow="md"
      width={200}
      opened={opened}
      closeOnClickOutside
      position="bottom-end"
      closeOnItemClick={false}

      onClose={close}
    >
      <Menu.Target>
        <ActionIcon
          size="sm"
          color="gray"
          variant="subtle"

          onClick={open}
        >
          <IconDotsVertical size={14} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>

        <DeleteNamespaceMenuItem
          namespace={namespace}
          projectData={projectData}

          onClose={close}
        />

      </Menu.Dropdown>
    </Menu>
  );
};
