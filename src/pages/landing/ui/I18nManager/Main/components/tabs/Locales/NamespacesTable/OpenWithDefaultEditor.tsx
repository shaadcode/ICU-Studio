import { Menu } from '@mantine/core';
import { attemptAsync } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { openPath } from '@tauri-apps/plugin-opener';
import { IconExternalLink } from '@tabler/icons-react';

import type { Project } from '@/pages/landing/config/store/i18nManager/types';

type Props = {
  namespace: Project['namespaces'][number];
};

export const OpenWithDefaultEditor = (props: Props) => {
  const t = useTranslations('i18nManager');

  const handleOpenWithEditor = async () => {
    const [error] = await attemptAsync(() => openPath(props.namespace.path, ''));
    if (error) {
      console.error('Failed to open file:', error);
    }
  };

  return (
    <Menu.Item
      leftSection={<IconExternalLink size={14} />}

      onClick={handleOpenWithEditor}
    >
      {t('localesTab.openWithEditor')}
    </Menu.Item>
  );
};
