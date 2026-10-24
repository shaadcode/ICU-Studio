import type { Theme } from 'json-edit-react';
import { IconX, IconPlus, IconEdit, IconCopy, IconTrash, IconCheck } from '@tabler/icons-react';

export const mantineJsonTheme: Theme = {
  displayName: 'MantineWithTabler',
  icons: {
    ok: {
      content: <IconCheck size={20} />,
    },
    cancel: {
      content: <IconX size={20} />,
    },
    add: {
      content: <IconPlus size={20} />,
    },
    edit: {
      content: <IconEdit size={20} />,
    },
    delete: {
      content: <IconTrash size={20} />,
    },
    copy: {
      content: <IconCopy size={20} color="var(--mantine-color-gray-4)" />,
    },
  },
  styles: {
    container: {
      backgroundColor: 'transparent',
    },
    iconCollection: {
      color: 'var(--mantine-color-text)',
      width: 'var(--mantine-spacing-xs)',
      height: 'var(--mantine-spacing-xs)',

    },
    bracket: {
      marginInlineStart: '3px',
      color: 'var(--mantine-color-text)',
      fontSize: 'var(--mantine-font-size-sm)',
      fontWeight: 'var(--mantine-font-weight-regular)',
    },

  },
};
