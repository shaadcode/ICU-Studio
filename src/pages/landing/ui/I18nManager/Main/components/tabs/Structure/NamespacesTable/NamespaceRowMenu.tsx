import { useDisclosure } from '@mantine/hooks';
// components/tabs/Structure/NamespaceRowMenu.tsx
import { Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

import { DeleteNamespaceMenuItem } from './menu-items/DeleteNamespaceMenuItem';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  namespaceName: string;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const NamespaceRowMenu = ({ projectData, namespaceName }: Props) => {
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
          projectData={projectData}
          namespaceName={namespaceName}

          onClose={close}
        />

      </Menu.Dropdown>
    </Menu>
  );
};
