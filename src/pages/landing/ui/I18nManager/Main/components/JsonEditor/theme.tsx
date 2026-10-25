import { Tooltip } from '@mantine/core';
import type { Theme } from 'json-edit-react';
import { IconX, IconCheck, IconCopyFilled, IconEditFilled, IconPlusFilled, IconTrashFilled } from '@tabler/icons-react';

type Translator = (key: string) => string;

export const createMantineJsonTheme = (t: Translator): Theme => ({
  displayName: 'MantineWithTabler',
  styles: {
    container: {
      height: '100%',
      backgroundColor: 'transparent',
    },
    iconCollection: {
      color: 'red',
      width: 'var(--mantine-spacing-xs)',
      height: 'var(--mantine-spacing-xs)',
    },
    bracket: {
      marginInlineStart: '3px',
      color: 'var(--mantine-color-orange-6)',
      fontSize: 'var(--mantine-font-size-sm)',
      fontWeight: 'var(--mantine-font-weight-regular)',
    },
  },
  icons: {
    add: {
      content: (
        <Tooltip withArrow label={t('i18nManager.jsonEditor.add')}>
          <IconPlusFilled size={20} />
        </Tooltip>
      ),
    },
    edit: {
      content: (
        <Tooltip withArrow label={t('i18nManager.jsonEditor.edit')}>
          <IconEditFilled size={20} />
        </Tooltip>
      ),
    },
    delete: {
      content: (
        <Tooltip withArrow label={t('i18nManager.jsonEditor.delete')}>
          <IconTrashFilled size={20} />
        </Tooltip>
      ),
    },
    cancel: {
      content: (
        <Tooltip withArrow label={t('i18nManager.jsonEditor.cancel')}>
          <IconX
            size={18}
            color="light-dark(var(--mantine-color-red-8), var(--mantine-color-red-6))"
          />
        </Tooltip>
      ),
    },
    ok: {
      content: (
        <Tooltip withArrow label={t('i18nManager.jsonEditor.ok')}>
          <IconCheck
            size={18}
            color="light-dark(var(--mantine-color-green-8), var(--mantine-color-green-6))"
          />
        </Tooltip>
      ),
    },
    copy: {
      content: (
        <Tooltip
          withArrow
          label={t('i18nManager.jsonEditor.copy')}
        >
          <IconCopyFilled
            size={20}
            color="light-dark(var(--mantine-color-gray-6), var(--mantine-color-gray-3))"
          />
        </Tooltip>
      ),
    },
  },
});
