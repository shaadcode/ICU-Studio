import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { IconKeyboard } from '@tabler/icons-react';
import { Kbd, Menu, Text, Modal, Table, Group, Title, Menubar } from '@mantine/core';

import { hotkeys } from '@/shared/config/mantine/hotKeys';

const HotkeyKeys = ({ keys }: { keys: string }) => {
  const keyParts = keys.split('+').map(k => k.trim());

  return (
    <Group gap={4} wrap="nowrap">
      {keyParts.map((key, i) => (
        <Kbd key={i} size="sm" style={{ textTransform: 'capitalize' }}>
          {key === 'mod' ? 'Ctrl / ⌘' : key}
        </Kbd>
      ))}
    </Group>
  );
};

export const HotkeysMenu = () => {
  const t = useTranslations('settings');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Menubar.Menu width={200}>
        <Menubar.Target>{t('help')}</Menubar.Target>
        <Menubar.Dropdown>
          <Menu.Item
            leftSection={<IconKeyboard size={16} />}

            onClick={open}
          >
            {t('keyboardShortcuts') || 'Keyboard Shortcuts'}
          </Menu.Item>
        </Menubar.Dropdown>
      </Menubar.Menu>

      <Modal
        centered
        size="lg"
        opened={opened}
        title={<Title order={3}>{t('keyboardShortcuts') || 'Keyboard Shortcuts'}</Title>}

        onClose={close}
      >
        <Text mb="md" size="sm" c="dimmed">
          {t('shortcutsDescription')}
        </Text>

        <Table striped withTableBorder highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('action')}</Table.Th>
              <Table.Th>{t('shortcut')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text fw={700} size="xs">{t('general')}</Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>{t('toggleTheme') }</Table.Td>
              <Table.Td><HotkeyKeys keys={hotkeys.toggleTheme} /></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>{t('toggleNavbar') }</Table.Td>
              <Table.Td><HotkeyKeys keys={hotkeys.toggleNavbar} /></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>{t('toggleSideBar') }</Table.Td>
              <Table.Td><HotkeyKeys keys={hotkeys.toggleSideBar} /></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>{t('openFloatingMenu')}</Table.Td>
              <Table.Td><HotkeyKeys keys={hotkeys.openFloatingMenu} /></Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text fw={700} size="xs">{t('editor') }</Text>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>{t('fixError') }</Table.Td>
              <Table.Td><HotkeyKeys keys={hotkeys.editor.fixError} /></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>{t('formatting') }</Table.Td>
              <Table.Td><HotkeyKeys keys={hotkeys.editor.formatting} /></Table.Td>
            </Table.Tr>

          </Table.Tbody>
        </Table>
      </Modal>
    </>
  );
};
