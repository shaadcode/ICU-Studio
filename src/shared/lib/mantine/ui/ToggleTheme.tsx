import type { ComponentProps } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';

import { hotkeys } from '@/shared/config/mantine/hotKeys';

type Props = {
  button?: ComponentProps<typeof ActionIcon<'div'>>;
};
function ThemeToggle(props: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  useHotkeys(
    [
      [hotkeys.toggleTheme, toggleColorScheme],
    ],
    [],
    true,
  );
  return (
    <ActionIcon
      variant="default"
      aria-label="Toggle color scheme"

      onClick={toggleColorScheme}
      {...props.button}
    >
      {colorScheme === 'dark'
        ? (<IconSun size={18} />)
        : (<IconMoon size={18} />)}
    </ActionIcon>
  );
}

export default ThemeToggle;
