import React from 'react';
import { Menu, Group } from '@mantine/core';
import type { Editor } from '@tiptap/react';
import type { MouseEventHandler } from 'react';
import { useDisclosure } from '@mantine/hooks';

import classes from './VariableActions.module.css';
import CutMessageMenuAction from './Items/CutMessage/CutMessage';
import CopyMessageMenuAction from './Items/CopyMessage/CopyMessage';
import type { MessageElementsTypeKeyword } from '@/shared/lib/icu/types';
import DeleteMessageMenuAction from './Items/DeleteMessage/DeleteMessage';
import ConvertVariableAction from './Items/ConvertVariable/ConvertVariable';
import DuplicateMessageMenuAction from './Items/DuplicateMessage/DuplicateMessage';
import SelectDefinitionMenuAction from './Items/SelectDefinition/SelectDefinition';

export type SharedActionProps = {
  editor: Editor;
  referenceId: string;
  elementType: MessageElementsTypeKeyword;
};

type Props = {
  eventTrigger: 'click' | 'contextMenu';
  children: (props: React.ComponentProps<any>) => React.JSX.Element;
} & SharedActionProps;

const VariableActions = ({ children, ...props }: Props) => {
  const [opened, handlers] = useDisclosure(false);
  const Children = children;
  const contextMenuEventHandler: MouseEventHandler = (e) => {
    e.preventDefault();
    handlers.open();
  };

  const onClickEventHandler: MouseEventHandler = () => {
    handlers.open();
  };

  return (
    <Menu
      withArrow
      width={100}
      shadow="md"
      opened={opened}
      position="bottom"
      classNames={{ itemLabel: classes['menuItemLabel'] }}

      onClose={handlers.close}
    >
      <Menu.Target>
        <Children
          onClick={props.eventTrigger === 'click'
            ? onClickEventHandler
            : undefined}
          onContextMenu={props.eventTrigger === 'contextMenu'
            ? contextMenuEventHandler
            : undefined}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Group grow gap={0} wrap="nowrap">
          <DeleteMessageMenuAction {...props} />
          <CopyMessageMenuAction {...props} />
          <CutMessageMenuAction {...props} />
        </Group>
        <ConvertVariableAction {...props} />
        <DuplicateMessageMenuAction {...props} />
        <SelectDefinitionMenuAction {...props} />
      </Menu.Dropdown>
    </Menu>
  );
};

export default VariableActions;
