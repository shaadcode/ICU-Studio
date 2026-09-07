import { useTranslations } from 'use-intl';
import { Text, Group } from '@mantine/core';

import classes from './../Navbar.module.css';
import CreateProject from './CreateProject/CreateProject';

const ProjectsNavbarHeader = () => {
  const t = useTranslations('common');

  return (
    <Group wrap="nowrap" justify="space-between">
      <Text classNames={{ root: classes['navbarTitle'] }}>
        {t('project', { project: 'other' })}
      </Text>
      <CreateProject />
    </Group>
  );
};

export default ProjectsNavbarHeader;
