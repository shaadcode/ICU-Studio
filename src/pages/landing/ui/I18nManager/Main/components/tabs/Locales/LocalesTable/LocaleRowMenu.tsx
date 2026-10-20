import { Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

import { DeleteLocaleMenuItem } from './DeleteLocaleConfirmModal';
import type { I18nManagerStore } from '@/pages/landing/config/store/i18nManager';
import { RevealInExplorerMenuItem } from '../../Structure/DetectedStructureTree/context-menu-items/RevealInExplorerMenuItem';

type Props = {
  projectData: NonNullable<I18nManagerStore['selectedProjectData']>;
  locale: NonNullable<I18nManagerStore['selectedProjectData']>['locales'][number];
};

export const LocaleRowMenu = ({ locale, projectData }: Props) => {
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          size="sm"
          color="gray"
          variant="subtle"

          onClick={e => e.stopPropagation()}
        >
          <IconDotsVertical size={14} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <RevealInExplorerMenuItem path={locale.path} />
        <DeleteLocaleMenuItem locale={locale} projectData={projectData} />
      </Menu.Dropdown>
    </Menu>
  );
};
