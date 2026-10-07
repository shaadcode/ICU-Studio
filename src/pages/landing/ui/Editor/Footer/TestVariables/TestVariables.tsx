import { attempt } from 'es-toolkit';
import React, { Fragment } from 'react';
import { useTranslations } from 'use-intl';
import { IntlMessageFormat } from 'intl-messageformat';
import { IconFlask2Filled } from '@tabler/icons-react';
import type { TYPE } from '@formatjs/icu-messageformat-parser';
import { Box, Text, Stack, Group, Paper, Divider } from '@mantine/core';

import WidgetHeader from '../../WidgetHeader';
import classes from './TestVariables.module.css';
import CopyMessageButton from './CopyMessageButton';
import TestDateField from './Elements/Date/TestDateField';
import TestTimeField from './Elements/Time/TestTimeField';
import TestPluralField from './Elements/Plural/TestPluralField';
import TestSelectField from './Elements/Select/TestSelectField';
import TestNumberField from './Elements/Number/TestNumberField';
import WidgetContainer from '../../WidgetContainer/WidgetContainer';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import TestSimpleVariableField from './Elements/SimpleVariable/SimpleVariable';

const TestVariablesWidget = () => {
  const tCommon = useTranslations('common');
  const variables = icuEditorStore.use.variables() ?? [];
  const parsedMessage = icuEditorStore.use.parsedMessage() ?? [];
  const keyValueVariables = variables.reduce((prevAcc, value) => ({ ...prevAcc, [value.name]: value.value }), {});

  const message = (() => {
    const [, printedMessage] = attempt(() => new IntlMessageFormat(parsedMessage).format(keyValueVariables));

    return (printedMessage ?? '') as string | Array<string>;
  })();

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

  if (!variables.length) {
    return null;
  }

  return (
    <WidgetContainer>
      <Stack>
        <Group wrap="nowrap" justify="space-between">
          <WidgetHeader
            icon={IconFlask2Filled}
            label={tCommon('preview')}
          />
        </Group>

        <Paper p="sm" shadow="xs">
          <Stack gap="xs">
            <Group wrap="nowrap" justify="space-between">
              <Text span fz="sm" fw={600} tt="capitalize">
                {tCommon('result')}
              </Text>

              { typeof message === 'string' && <CopyMessageButton previewMessage={message} />}
            </Group>
            <Box className={classes['preview-container']}>
              <Text mod={{ 'data-testid': 'preview-value' }}>
                {message}
              </Text>
            </Box>
          </Stack>

        </Paper>
        <Paper p="sm" shadow="xs">
          <Stack gap="xs">
            {items}
          </Stack>
        </Paper>

      </Stack>
    </WidgetContainer>
  );
};

export default TestVariablesWidget;
