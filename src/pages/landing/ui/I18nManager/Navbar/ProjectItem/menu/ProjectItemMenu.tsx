import { useState } from 'react';
import { modals } from '@mantine/modals';
import { useTranslations } from 'use-intl';
import { Text, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconTrash } from '@tabler/icons-react';

import type { BaseProjectInfo } from '../../CreateNewProject/types';
import { i18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { RevealInExplorerMenuItem } from '../../../Main/components/tabs/Structure/DetectedStructureTree/context-menu-items/RevealInExplorerMenuItem';

type Props = {
  project: BaseProjectInfo;
};

export const ProjectItemMenu = ({ project }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const tCommon = useTranslations('common');
  const tI18nManager = useTranslations('i18nManager');
  const deleteProject = i18nManagerStore.use.actions().deleteProject;

  const openDeleteConfirmModal = (e: React.MouseEvent) => {
    e.stopPropagation();

    modals.openConfirmModal({
      centered: true,
      cancelProps: { disabled: isLoading },
      confirmProps: { color: 'red', loading: isLoading },
      title: tI18nManager('structure.modals.deleteProject.title'),
      labels: {
        cancel: tCommon('cancel'),
        confirm: tCommon('delete'),
      },
      onConfirm: async () => {
        setIsLoading(true);
        await deleteProject({ project, tCommon, tI18nManager });
        setIsLoading(false);
      },

      children: (
        <Text size="sm">
          {tI18nManager('structure.modals.deleteProject.message', {
            projectName: project.name,
          })}
        </Text>
      ),
    });
  };

  return (
    <Menu shadow="md" width={160} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          size="sm"
          color="gray"
          variant="subtle"

          onClick={e => e.stopPropagation()}
        >
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown onClick={e => e.stopPropagation()}>
        <RevealInExplorerMenuItem path={project.path} />
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}

          onClick={openDeleteConfirmModal}
        >
          {tCommon('delete')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
