import { attempt } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import React, { useMemo, Fragment } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';
import { IconFlask2Filled } from '@tabler/icons-react';
import type { TYPE } from '@formatjs/icu-messageformat-parser';
import {
  Box,
  Text,
  Stack,
  Group,
  Paper,
  Divider,
  ScrollAreaAutosize,
} from '@mantine/core';

import WidgetHeader from '../../WidgetHeader';
import classes from './TestVariables.module.css';
import CopyMessageButton from './CopyMessageButton';
import { MOBILE_BREAKPOINT } from '@/shared/lib/mantine';
import TestDateField from './Elements/Date/TestDateField';
import TestTimeField from './Elements/Time/TestTimeField';
import TestPluralField from './Elements/Plural/TestPluralField';
import TestSelectField from './Elements/Select/TestSelectField';
import TestNumberField from './Elements/Number/TestNumberField';
import WidgetContainer from '../../WidgetContainer/WidgetContainer';
import { TestVariablesEmptyState } from './TestVariablesEmptyState';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import TestSimpleVariableField from './Elements/SimpleVariable/SimpleVariable';

const VARIABLE_COMPONENTS = {
  0: () => <></>,
  7: () => <></>,
  8: () => <></>,
  3: TestDateField,
  4: TestTimeField,
  2: TestNumberField,
  5: TestSelectField,
  6: TestPluralField,
  1: TestSimpleVariableField,
} as const satisfies Record<`${TYPE}`, (props: any) => React.JSX.Element>;

const TestVariablesWidget = () => {
  const t = useTranslations('editor');
  const tCommon = useTranslations('common');
  const variables = icuEditorStore.use.variables();
  const parsedMessage = icuEditorStore.use.parsedMessage();

  const hasVariables = variables.length > 0;

  const previewMessage = useMemo(() => {
    if (!parsedMessage?.length || !hasVariables) {
      return '';
    }

    const keyValueVariables = variables.reduce<Record<string, unknown>>(
      (acc, variable) => {
        acc[variable.name] = variable.value;
        return acc;
      },
      {},
    );

    const [, printedMessage] = attempt(
      () => new IntlMessageFormat(parsedMessage).format(keyValueVariables),
    );

    return (printedMessage ?? '') as string | Array<string>;
  }, [parsedMessage, variables, hasVariables]);

  const items = useMemo(() => {
    if (!hasVariables) {
      return null;
    }

    return variables.map((variable, i) => {
      const Component = VARIABLE_COMPONENTS[variable.enumType];

      if (!Component) {
        return null;
      }

      const isLast = i === variables.length - 1;

      return (
        <Fragment key={`${variable.name}-${variable.enumType}`}>
          <Component data={variable} />
          {!isLast && <Divider />}
        </Fragment>
      );
    });
  }, [variables, hasVariables]);

  return (
    <WidgetContainer mod={{ 'data-footer-widget': true }}>
      <Box className={classes['inner-container']}>
        <Group wrap="nowrap" justify="space-between">
          <WidgetHeader
            label={tCommon('preview')}
            containerProps={{ visibleFrom: MOBILE_BREAKPOINT }}
            icon={props => (
              <IconFlask2Filled color="var(--mantine-color-green-6)" {...props} />
            )}
          />
        </Group>

        <Paper p="sm" mih={0} h="100%" shadow="xs">
          {hasVariables
            ? (
                <ScrollAreaAutosize h="100%" scrollbars="y" offsetScrollbars>
                  <Stack gap="xs" h="100%">
                    {items}
                  </Stack>
                </ScrollAreaAutosize>
              )
            : (
                <TestVariablesEmptyState />
              )}
        </Paper>

        <Paper p="sm" shadow="xs">
          <Stack gap={0}>
            <Group wrap="nowrap" justify="space-between">
              <Text span fz="sm" fw={600} tt="capitalize">
                {tCommon('result')}
              </Text>

              {hasVariables && typeof previewMessage === 'string' && (
                <CopyMessageButton previewMessage={previewMessage} />
              )}
            </Group>

            <Box className={classes['preview-container']}>
              {hasVariables
                ? (
                    <Text
                      fz="sm"
                      textWrap="wrap"
                      mod={{ 'data-testid': 'preview-value' }}
                    >
                      {previewMessage}
                    </Text>
                  )
                : (
                    <Text size="sm" c="dimmed" ta="center">
                      {t('widgets.testVariables.empty.result')}
                    </Text>
                  )}
            </Box>
          </Stack>
        </Paper>
      </Box>
    </WidgetContainer>
  );
};

export default TestVariablesWidget;
