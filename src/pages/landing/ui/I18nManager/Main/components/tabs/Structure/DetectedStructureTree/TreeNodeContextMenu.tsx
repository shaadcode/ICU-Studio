// components/tabs/Structure/TreeNodeContextMenu.tsx
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { CopyPathMenuItem } from './context-menu-items/CopyPathMenuItem';
import type { I18nProjectTree } from '@/shared/lib/mantine/getI18nProjectData';
import { DeleteLocaleMenuItem } from './context-menu-items/DeleteLocaleMenuItem';
import { RevealInExplorerMenuItem } from './context-menu-items/RevealInExplorerMenuItem';

type Props = {
  isLocale: boolean;
  node: I18nProjectTree;
  children: (props: React.ComponentProps<any>) => React.JSX.Element;
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

          onClose={contextMenuHandlers.close}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
