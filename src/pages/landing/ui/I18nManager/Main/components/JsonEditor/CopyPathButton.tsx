import { useTranslations } from 'use-intl';
import { useClipboard } from '@mantine/hooks';
import type { NodeData } from 'json-edit-react';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconRoute, IconCheck } from '@tabler/icons-react';

export const CopyPathButton = ({
  nodeData,
}: {
  nodeData: NodeData;
}) => {
  const t = useTranslations();
  const clipboard = useClipboard({ timeout: 1500 });

  const handleCopy = () => {
    const pathString = nodeData.path.join('.');
    clipboard.copy(pathString);
  };

  return (
    <Tooltip
      withArrow
      tt="lowercase"
      label={clipboard.copied ? t('common.copied') : t('i18nManager.jsonEditor.copyPath')}
    >
      <ActionIcon
        size="sm"
        variant="subtle"
        color={clipboard.copied ? 'teal' : 'gray'}

        onClick={handleCopy}
      >
        {clipboard.copied ? <IconCheck size={16} /> : <IconRoute size={16} />}
      </ActionIcon>
    </Tooltip>
  );
};
