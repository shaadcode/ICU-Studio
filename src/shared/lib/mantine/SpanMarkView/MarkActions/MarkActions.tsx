import React from 'react';
import type { ComponentProps } from 'react';
import { Menu, Group } from '@mantine/core';
import type { Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './MarkActions.module.css';
import CutMessageMenuAction from './Items/CutMessage/CutMessage';
import CopyMessageMenuAction from './Items/CopyMessage/CopyMessage';
import DeleteMessageMenuAction from './Items/DeleteMessage/DeleteMessage';

type Props = {
  tiptapMark: MarkViewRendererProps;
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
        <Group grow gap={0} wrap="nowrap">
          <DeleteMessageMenuAction tiptapMark={props.tiptapMark} />
          <CopyMessageMenuAction tiptapMark={props.tiptapMark} />
          <CutMessageMenuAction tiptapMark={props.tiptapMark} />
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MarkActions;
