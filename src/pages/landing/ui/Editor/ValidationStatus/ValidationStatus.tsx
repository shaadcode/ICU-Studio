import { useTranslations } from 'use-intl';
import { useDisclosure } from '@mantine/hooks';
import { Text, Badge, Popover } from '@mantine/core';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';

import classes from './ValidationStatus.module.css';
import { warningErrors } from '@/shared/lib/icu/constants';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const ValidationStatus = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const tEditor = useTranslations('editor.parsingErrors');
  const t = useTranslations('common');
  const parserError = icuEditorStore.use.validationError();
  const hasError = !!parserError;
  const isWarning = parserError?.message ? !!warningErrors[parserError.message] : false;

  return (
    <Popover
      withArrow
      width={200}
      shadow="md"
      position="bottom"
      opened={hasError ? opened : false}
      transitionProps={{ exitDelay: 500 }}
    >
      <Popover.Target>
        <Badge
          variant="light"
          mod={{ 'data-has-error': hasError || undefined }}
          color={isWarning ? 'yellow' : hasError ? 'red' : 'green'}
          classNames={{ root: classes['badgeRoot'], label: classes['badgeLabel'] }}
          leftSection={hasError
            ? <IconExclamationCircle size="15px" />
            : <IconCheck size="15px" />}

          onMouseEnter={open}
          onMouseLeave={close}
        >
          {isWarning ? t('warning') : hasError ? t('error') : t('valid') }
        </Badge>
      </Popover.Target>
      <Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
        <Text size="xs">
          {parserError?.message ? tEditor(parserError.message) : ''}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ValidationStatus;
