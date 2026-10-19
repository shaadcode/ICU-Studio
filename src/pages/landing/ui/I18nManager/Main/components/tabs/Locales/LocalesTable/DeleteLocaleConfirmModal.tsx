import { modals } from '@mantine/modals';
import { Menu, Text } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconTrash } from '@tabler/icons-react';

import { i18nManagerPatternsActions } from '@/pages/landing/model/patterns';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  locale: NonNullable<I18nManagerStore['selectedProjectData']>['locales'][number];
};

export const DeleteLocaleMenuItem = ({ locale, projectData }: Props) => {
  const t = useTranslations('i18nManager');
  const tCommon = useTranslations('common');
  const setSelectedProjectData = i18nManagerStore.use.actions().setSelectedProjectData;
  const handleClick = () => {
    modals.openConfirmModal({
      centered: true,
      confirmProps: { color: 'red' },
      title: t('structure.modals.deleteLocale.title'),
      labels: {
        cancel: tCommon('cancel'),
        confirm: tCommon('delete'),
      },
      children: (
        <Text size="sm">
          {t('structure.modals.deleteLocale.message', {
            locale: locale.language.code,
          })}
        </Text>
      ),
      onConfirm: async () => {
        const patternAction = i18nManagerPatternsActions[projectData.structureType];
        await patternAction.deleteLocale({
          ...projectData,
          locale,
          setSelectedProjectData,
        });
      },
    });
  };

  return (
    <Menu.Item

      color="red"
      leftSection={<IconTrash size={14} />}

      onClick={handleClick}
    >
      {tCommon('delete')}
    </Menu.Item>
  );
};
