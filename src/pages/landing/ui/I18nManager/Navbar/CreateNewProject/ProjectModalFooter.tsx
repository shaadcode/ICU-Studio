import { Group, Button } from '@mantine/core';

type Props = {
  submitLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
};

export const ProjectModalFooter = ({
  onCancel,
  onSubmit,
  submitLabel,
  cancelLabel,
}: Props) => {
  return (
    <Group mt="xl" justify="flex-end">
      <Button
        variant="default"

        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button onClick={onSubmit}>{submitLabel}</Button>
    </Group>
  );
};
