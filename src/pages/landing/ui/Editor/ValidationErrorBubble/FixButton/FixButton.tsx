import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { useHotkeys } from '@mantine/hooks';
// FixButton.tsx
import { Menu, Button, Tooltip } from '@mantine/core';
import { IconWand, IconChevronDown } from '@tabler/icons-react';

import { fixers } from './fixers';
import classes from './FixButton.module.css';
import type { Fixer, FixContext } from './fixers';
import { hotkeys } from '@/shared/config/mantine/hotKeys';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

type Props = {
  context: FixContext;
  onFixed?: (fixerId: string) => void;
};

export const FixButton = ({ context, onFixed }: Props) => {
  const t = useTranslations('editor');
  const validationError = icuEditorStore.use.validationError();

  const availableFixers = useMemo(() => {
    if (!context || !validationError) {
      return [];
    }
    return (fixers[validationError.message] ?? []).filter(
      fixer => !fixer.condition || fixer.condition(context),
    );
  }, [context, validationError]);

  const firstFixer = availableFixers[0];

  const handleApply = async (fixer: Fixer) => {
    const result = await fixer.apply(context);
    if (result !== false) {
      onFixed?.(fixer.id);
    }
  };

  useHotkeys(
    [
      [hotkeys.editor.fixError, () => firstFixer && handleApply(firstFixer)],
    ],
    [],
    true,
  );
  if (availableFixers.length === 0) {
    return null;
  }

  if (availableFixers.length === 1) {
    return (
      <Tooltip
        label={t(firstFixer!.labelKey)}
        styles={{ tooltip: { fontSize: '10px' } }}
      >
        <Button
          size="xs"
          color="red"
          tt="capitalize"
          leftSection={<IconWand size={14} />}

          onClick={() => handleApply(availableFixers[0]!)}
        >
          {t('validation.fix')}
        </Button>
      </Tooltip>
    );
  }

  return (

    <Menu
      classNames={{ dropdown: classes['dropdown'] }}
    >
      <Menu.Target>
        <Button.Group>
          <Tooltip
            label={t(firstFixer!.labelKey)}
            styles={{ tooltip: { fontSize: '10px' } }}
          >
            <Button
              size="xs"
              color="red"
              tt="capitalize"
              leftSection={<IconWand size={14} />}

              onClick={() => handleApply(availableFixers[0]!)}
            >
              {t('validation.fix')}
            </Button>
          </Tooltip>
          <Button
            px={6}
            size="xs"
            color="red"
            aria-label={t('validation.moreFixes')}
          >
            <IconChevronDown size={14} />
          </Button>
        </Button.Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('validation.chooseFix')}</Menu.Label>
        {availableFixers.map(fixer => (
          <Menu.Item
            fz="xs"
            key={fixer.id}

            onClick={() => handleApply(fixer)}
          >
            {t(fixer.labelKey)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
