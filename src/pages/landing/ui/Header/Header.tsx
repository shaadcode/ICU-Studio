import { Group } from '@mantine/core';

import Logo from './Logo';
import { ThemeToggle } from '@/shared/lib/mantine';

const Header = () => {
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

      </Group>

      <ThemeToggle />
    </Group>
  );
};

export default Header;
