// MenuBar/MenuItemBase.tsx
import { memo } from 'react';
import { Kbd, Menu, Group } from '@mantine/core';

type Props = {
  label: string;
  hotkey?: string;
  onClick: () => void;
};

export const MenuItemBase = memo(({ label, hotkey, onClick }: Props) => {
  return (
    <Menu.Item
      fz="xs"
      rightSection={
        hotkey
          ? (
              <Group gap={2} wrap="nowrap">
                {hotkey.split('+').map((key, i) => (
                  <Kbd size="xs" key={`${key}-${i}`}>
                    {key}
                  </Kbd>
                ))}
              </Group>
            )
          : undefined
      }

      onClick={onClick}
    >
      {label}
    </Menu.Item>
  );
});

MenuItemBase.displayName = 'MenuItemBase';
