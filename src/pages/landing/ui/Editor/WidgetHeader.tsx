import { Text, Group } from '@mantine/core';
import type { IconProps } from '@tabler/icons-react';

type Props = {
  label: string;
  icon: (props: IconProps) => React.JSX.Element;
};

const WidgetHeader = (props: Props) => {
  return (
    <Group gap={6} wrap="nowrap" align="center">
      <props.icon
        size={16}
      />
      <Text span fz="sm" fw={600} tt="capitalize">
        {props.label}
      </Text>
    </Group>
  );
};

export default WidgetHeader;
