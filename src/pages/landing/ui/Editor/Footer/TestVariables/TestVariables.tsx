import { attempt } from 'es-toolkit';
import React, { Fragment } from 'react';
import { useTranslations } from 'use-intl';
import { IntlMessageFormat } from 'intl-messageformat';
import { IconFlask2Filled } from '@tabler/icons-react';
import type { TYPE } from '@formatjs/icu-messageformat-parser';
import { Box, Text, Stack, Group, Paper, Divider, ScrollAreaAutosize } from '@mantine/core';

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

const TestVariablesWidget = () => {
  const tCommon = useTranslations('common');
  const t = useTranslations('editor');
  const variables = icuEditorStore.use.variables() ?? [];
  const parsedMessage = icuEditorStore.use.parsedMessage() ?? [];
  const keyValueVariables = variables.reduce(
    (prevAcc, value) => ({ ...prevAcc, [value.name]: value.value }),
    {},
  );

  const message = (() => {
    const [, printedMessage] = attempt(
      () => new IntlMessageFormat(parsedMessage).format(keyValueVariables),
    );
    return (printedMessage ?? '') as string | Array<string>;
  })();

  const hasVariables = variables.length > 0;

  const items = variables.map((element, i) => {
    const components = {
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

    const Component = components[element.enumType];

    return Component
      ? (
          <Fragment key={`${element.name}-${element.enumType}`}>
            <Component data={element} />
            {i < variables.length - 1 && <Divider />}
          </Fragment>
        )
      : null;
  });

  return (
    <WidgetContainer
      mod={{ 'data-footer-widget': true }}
      className={classes['widget-container']}
    >
      <Group wrap="nowrap" justify="space-between">
        <WidgetHeader
          label={tCommon('preview')}
          containerProps={{ visibleFrom: MOBILE_BREAKPOINT }}
          icon={props => (
            <IconFlask2Filled
              color="var(--mantine-color-green-6)"
              {...props}
            />
          )}
        />
      </Group>
      <Paper p="sm" pie={0} mih={0} h="100%" shadow="xs">
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
            {typeof message === 'string' && hasVariables && (
              <CopyMessageButton previewMessage={message} />
            )}
          </Group>
          <Box className={classes['preview-container']}>
            {hasVariables
              ? (
                  <Text fz="sm" mod={{ 'data-testid': 'preview-value' }}>{message}</Text>
                )
              : (
                  <Text size="sm" c="dimmed" ta="center">
                    {t('widgets.testVariables.empty.result')}
                  </Text>
                )}
          </Box>
        </Stack>
      </Paper>
    </WidgetContainer>
  );
};

export default TestVariablesWidget;
