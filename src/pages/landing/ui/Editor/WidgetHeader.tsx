import { Text, Group } from '@mantine/core';

type Props = {
  icon: any;
  label: string;
};

const WidgetHeader = (props: Props) => {
  return (
    <Group gap={6} wrap="nowrap" align="center">
      <props.icon
        size={16}
        color="var(--mantine-color-gray-6)"
      />
      <Text span fz="sm" fw={600} tt="capitalize">
        {props.label}
      </Text>
    </Group>
  );
};

export default WidgetHeader;
