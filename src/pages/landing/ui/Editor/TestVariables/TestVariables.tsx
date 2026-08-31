import React from 'react';
import { attempt } from 'es-toolkit';
import { useTranslations } from 'use-intl';
import { IntlMessageFormat } from 'intl-messageformat';
import { notifications } from '@mantine/notifications';
// import { IntlMessageFormat } from 'intl-messageformat';
import type { TYPE } from '@formatjs/icu-messageformat-parser';
import { Text, Stack, Paper, Group, Accordion } from '@mantine/core';

import classes from './TestVariables.module.css';
import CopyMessageButton from './CopyMessageButton';
import TestDateField from './Elements/Date/TestDateField';
import TestTimeField from './Elements/Time/TestTimeField';
import { icuEditorStore } from '@/pages/landing/config/store';
import TestPluralField from './Elements/Plural/TestPluralField';
import TestSelectField from './Elements/Select/TestSelectField';
import TestNumberField from './Elements/Number/TestNumberField';
import TestSimpleVariableField from './Elements/SimpleVariable/SimpleVariable';
import { TEST_VARIABLES_ACCORDION_TRANSITION_DURATION } from '@/shared/lib/mantine';

const TestVariables = () => {
  const t = useTranslations('editor');
  const variables = icuEditorStore.use.variables() ?? [];
  const parsedMessage = icuEditorStore.use.parsedMessage() ?? [];
  const keyValueVariables = variables.reduce((prevAcc, value) => ({ ...prevAcc, [value.name]: value.value }), {});

  const message = (() => {
    const [, printedMessage] = attempt(() => new IntlMessageFormat(parsedMessage).format(keyValueVariables));

    if (!printedMessage) {
      notifications.show({
        message: 'error',
      });
      return '';
    }
    return (printedMessage ?? '') as string | Array<string>;
  })();

  const items = variables.map((element) => {
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
          <Component
            data={element}
            key={`${element.name}-${element.enumType}`}
          />
        )
      : null;
  });

  if (!variables.length) {
    return null;
  }

  return (
    <Stack>
      <Paper p="lg" withBorder shadow="xs">
        <Stack>
          <Group className={classes['previewTitleContainer']}>
            <Text className={classes['previewTitle']}>
              {t('livePreview')}
            </Text>
            <CopyMessageButton />
          </Group>
          <Text mod={{ 'data-testid': 'preview-value' }}>
            {message}
          </Text>
        </Stack>
      </Paper>

      <Accordion
        order={4}
        transitionDuration={TEST_VARIABLES_ACCORDION_TRANSITION_DURATION}
        classNames={{
          root: classes['accordionRoot'],
          item: classes['accordionItem'],
        }}
      >
        {items}
      </Accordion>
    </Stack>
  );
};

export default TestVariables;
