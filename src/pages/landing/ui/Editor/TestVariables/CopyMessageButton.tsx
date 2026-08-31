import { ActionIcon, CopyButton } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

import { icuEditorStore } from '@/pages/landing/config/store';

const CopyMessageButton = () => {
  const message = icuEditorStore.use.message() ?? '';

  return (
    <CopyButton value={message}>
      {({ copy, copied }) => (
        <ActionIcon
          color="gray"
          variant="transparent"

          onClick={copy}
        >
          {copied ? <IconCheck size="80%" /> : <IconCopy size="80%" />}
        </ActionIcon>
      )}
    </CopyButton>
  );
};

export default CopyMessageButton;
