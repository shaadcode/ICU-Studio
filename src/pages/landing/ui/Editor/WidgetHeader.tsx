import { Text, Group } from '@mantine/core';
import type { IconProps } from '@tabler/icons-react';
import type { ReactNode, ComponentProps } from 'react';

type Props = {
  label: string;
  endSection?: ReactNode;
  icon: (props: IconProps) => React.JSX.Element;
  containerProps?: ComponentProps<typeof Group>;
};

const WidgetHeader = (props: Props) => {
  return (
    <Group wrap="nowrap" align="center" justify="space-between" {...props.containerProps}>
      <Group wrap="nowrap">
        <props.icon
          size={16}
        />
        <Text span fz="sm" fw={600} tt="capitalize">
          {props.label}
        </Text>
      </Group>
      {props.endSection && (
        <Group wrap="nowrap">
          {props.endSection}
        </Group>
      )}
    </Group>
  );
};

export default WidgetHeader;
