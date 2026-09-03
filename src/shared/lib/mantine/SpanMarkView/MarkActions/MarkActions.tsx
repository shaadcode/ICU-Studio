import React from 'react';
import { Menu } from '@mantine/core';
import type { ComponentProps } from 'react';
import type { Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './MarkActions.module.css';
import DeleteMessageMenuAction from './Items/DeleteMessage/DeleteMessage';

type Props = {
  view: MarkViewRendererProps;
  popoverRoot?: ComponentProps<typeof Popover>;
  children: (props: React.ComponentProps<'div'>) => React.JSX.Element;
};

const MarkActions = (props: Props) => {
  const [opened, handlers] = useDisclosure(false);
  const Children = props.children;
  return (
    <Menu
      withArrow
      width={100}
      shadow="md"
      opened={opened}
      position="bottom"
      classNames={{
        itemLabel: classes['menuItemLabel'],
      }}

      onClose={handlers.close}
    >
      <Menu.Target>
        <Children onContextMenu={(e) => {
          e.preventDefault();
          handlers.open();
        }}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <DeleteMessageMenuAction view={props.view} />
      </Menu.Dropdown>
    </Menu>
  );
};

export default MarkActions;
