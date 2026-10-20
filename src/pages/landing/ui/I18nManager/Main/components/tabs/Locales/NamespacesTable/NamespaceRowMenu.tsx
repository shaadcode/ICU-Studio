import { Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

import { DeleteNamespaceMenuItem } from './DeleteNamespaceConfirmModal';
import type { Project } from '@/pages/landing/config/store/i18nManager/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { RevealInExplorerMenuItem } from '../../Structure/DetectedStructureTree/context-menu-items/RevealInExplorerMenuItem';

type Props = {
  namespace: Project['namespaces'][number];
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const NamespaceTableRowMenu = ({ namespace, projectData }: Props) => {
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          size="sm"
          color="gray"
          variant="subtle"

          onClick={e => e.stopPropagation()}
        >
          <IconDotsVertical size={14} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <RevealInExplorerMenuItem path={namespace.path} />

        <DeleteNamespaceMenuItem
          namespace={namespace}
          projectData={projectData}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
