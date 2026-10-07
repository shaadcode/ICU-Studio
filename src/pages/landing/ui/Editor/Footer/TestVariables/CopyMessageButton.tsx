import { useTranslations } from 'use-intl';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { Tooltip, ActionIcon, CopyButton } from '@mantine/core';

type Props = {
  previewMessage: string;
};

const CopyMessageButton = (props: Props) => {
  const t = useTranslations('editor');

  return (
    <CopyButton value={props.previewMessage}>
      {({ copy, copied }) => (
        <Tooltip label={t('copyPreview')}>
          <ActionIcon
            size="md"
            color="gray"
            variant="transparent"
            style={{ boxShadow: 'none' }}

            onClick={copy}
          >
            {copied ? <IconCheck size="60%" /> : <IconCopy size="60%" />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CopyMessageButton;
