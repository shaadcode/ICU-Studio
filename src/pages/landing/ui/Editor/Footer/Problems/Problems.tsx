import { Stack } from '@mantine/core';
import { useTranslations } from 'use-intl';
import { IconAlertHexagonFilled } from '@tabler/icons-react';

import WidgetHeader from '../../WidgetHeader';
import { EmptyState } from './states/EmptyState';
import { ValidState } from './states/ValidState';
import { InvalidState } from './states/InvalidState';
import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import { UnformattedState } from './states/UnformattedState';
import { EditorNotReadyState } from './states/EditorNotReadyState';
import WidgetContainer from '../../WidgetContainer/WidgetContainer';
import { icuEditorStore } from '@/pages/landing/config/store/editor';

const ICUEditorProblemsWidgets = () => {
  const t = useTranslations('common');

  const errorLocation = icuEditorStore.use.errorLocation();
  const editor = icuEditorStore.use.editorInstance();
  const validationError = icuEditorStore.use.validationError();
  const isFormatted = icuEditorStore.use.isFormatted();
  const isEmpty = icuEditorStore.use.isEmpty();
  const formatContent = icuEditorStore.use.actions().formatContent;
  const hasProblem = Boolean(validationError || errorLocation);
  const problemCount = hasProblem ? 1 : 0;

  const renderState = () => {
    if (!editor) {
      return <EditorNotReadyState />;
    }
    if (isEmpty) {
      return <EmptyState />;
    }
    if (hasProblem) {
      return (
        <InvalidState
          editor={editor}
          errorLocation={errorLocation!}
          validationError={validationError!}
        />
      );
    }
    if (isFormatted) {
      return <ValidState />;
    }
    return <UnformattedState onFormat={formatContent} />;
  };

  return (
    <WidgetContainer mod={{ 'data-footer-widget': true }}>
      <Stack h="100%">
        <WidgetHeader
          label={t('problem', { count: problemCount })}
          containerProps={{ visibleFrom: MOBILE_BREAKPOINT }}
          icon={props => (
            <IconAlertHexagonFilled
              color="var(--mantine-color-red-6)"
              {...props}
            />
          )}
        />
        {renderState()}
      </Stack>
    </WidgetContainer>
  );
};

export default ICUEditorProblemsWidgets;
