import { Group } from '@mantine/core';

import Logo from '../../Logo';
import { ThemeToggle } from '@/shared/lib/mantine';
import MenuBar from '../../Header/MenuBar/MenuBar';

const I18nManagerHeader = () => {
  return (
    <Group
      px="xs"
      h="100%"
      align="center"
      component="header"
      justify="space-between"
    >
      <Group>
        <Logo />
        <MenuBar />
      </Group>

      <ThemeToggle />
    </Group>
  );
};

export default I18nManagerHeader;
