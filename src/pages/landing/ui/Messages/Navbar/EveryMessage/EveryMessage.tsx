import { IconTrash, IconDotsVertical } from '@tabler/icons-react';
import { Box, Menu, Text, Group, Paper, ActionIcon } from '@mantine/core';

import classes from './EveryMessage.module.css';
import { useEveryMessageHandlers } from './useEveryMessageHandlers';
import type { MessageSchema } from '../CreateMessage/CreateMessage';

type Props = {
  message: MessageSchema;
};

const EveryMessage = (props: Props) => {
  const message = props.message;
  const handlers = useEveryMessageHandlers(props);

  return (
    <Paper
      withBorder
      component={Group}
      key={message.name}
      className={classes['messageContainer']}
      mod={{
        'data-is-active': message.dirPath === handlers.selectedMessage?.dirPath || undefined,
      }}

      onClick={() => {
        if (message.dirPath === handlers.selectedMessage?.dirPath) {
          return;
        } else if (handlers.isDirty) {
          return handlers.dirtyModal(message);
        }
        handlers.handleSelectMessage(message);
      }}
    >
      <Group gap="xs" wrap="nowrap">
        <Text fz="sm" truncate>
          {message.name}
        </Text>
        {handlers.selectedMessage?.dirPath === message?.dirPath
          && handlers.isDirty
          && <Box h={6} w={6} bg="green" bdrs={9999} />}
      </Group>
      <Menu withArrow shadow="md">
        <Menu.Target>
          <ActionIcon
            size="sm"
            radius="sm"
            variant="subtle"
            style={{ boxShadow: 'none' }}

            onClick={e => e.stopPropagation()}
          >
            <IconDotsVertical size="80%" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            style={{ cursor: 'pointer' }}

            onClick={(e) => {
              e.stopPropagation();
              handlers.deleteMessage(message);
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <IconTrash size={16} color="red" />
              <Text fz="xs" c="red" tt="capitalize">
                {handlers.tCommon('delete')}
              </Text>
            </Group>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
};

export default EveryMessage;
