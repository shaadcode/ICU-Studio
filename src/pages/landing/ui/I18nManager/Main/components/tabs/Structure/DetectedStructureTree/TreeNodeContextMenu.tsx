// components/tabs/Structure/TreeNodeContextMenu.tsx
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { CopyPathMenuItem } from './context-menu-items/CopyPathMenuItem';
import type { I18nProjectTree } from '@/pages/landing/model/patterns/types';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { DeleteLocaleMenuItem } from './context-menu-items/DeleteLocaleMenuItem';
import { DeleteNamespaceMenuItem } from './context-menu-items/DeleteNamespaceMenuItem';
import { RevealInExplorerMenuItem } from './context-menu-items/RevealInExplorerMenuItem';

type Props = {
  isLocale: boolean;
  node: I18nProjectTree;
  children: (props: React.ComponentProps<any>) => React.JSX.Element;
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
};

export const TreeNodeContextMenu = (props: Props) => {
  const [opened, contextMenuHandlers] = useDisclosure(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenuHandlers.open();
  };

  const Children = props.children;

  return (
    <Menu
      withArrow
      offset={5}
      opened={opened}
      position="bottom"
      closeOnClickOutside
      closeOnItemClick={false}

      onClose={contextMenuHandlers.close}
    >
      <Menu.Target>
        <Children onContextMenu={handleContextMenu} />
      </Menu.Target>

      <Menu.Dropdown>
        <RevealInExplorerMenuItem
          node={props.node}

          onClose={contextMenuHandlers.close}
        />
        <CopyPathMenuItem
          node={props.node}

          onClose={contextMenuHandlers.close}
        />

        <DeleteLocaleMenuItem
          node={props.node}
          projectData={props.projectData}

          onClose={contextMenuHandlers.close}
        />

        <DeleteNamespaceMenuItem
          node={props.node}
          projectData={props.projectData}

          onClose={contextMenuHandlers.close}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
