import React, { useEffect } from 'react';
import { useTranslations } from 'use-intl';
import { Text, Stack, Accordion } from '@mantine/core';
import { IntlMessageFormat } from 'intl-messageformat';
// import { IntlMessageFormat } from 'intl-messageformat';
import type { TYPE } from '@formatjs/icu-messageformat-parser';

import { icuEditorStore } from '@/pages/landing/config/store';
import TestPluralField from './Elements/Plural/TestPluralField';
import TestSelectField from './Elements/Select/TestSelectField';
import TestNumberField from './Elements/Number/TestNumberField';
import TestSimpleVariableField from './Elements/SimpleVariable/SimpleVariable';

const TestVariables = () => {
  const t = useTranslations('editor');
  const variables = icuEditorStore.use.variables() ?? [];
  const parsedMessage = icuEditorStore.use.parsedMessage() ?? [];

  const items = variables.map((element, i) => {
    const components: Record<`${TYPE}`, () => React.JSX.Element> = {
      0: () => <></>,
      3: () => <></>,
      4: () => <></>,
      7: () => <></>,
      8: () => <></>,
      2: () => <TestNumberField data={element} />,
      5: () => <TestSelectField data={element} />,
      6: () => <TestPluralField data={element} />,
      1: () => <TestSimpleVariableField data={element} />,

    };

    const Component = components[element.enumType];

    return Component ? <Component key={i} /> : null;
  });
  useEffect(() => {
    try {
      console.log(variables);
      const keyValueVariables = variables.reduce((prevAcc, value) => {
        if (value.name) {
          return { ...prevAcc, [value.name]: value.value };
        } else {
          return prevAcc;
        }
      }, {});
      console.log(new IntlMessageFormat(parsedMessage).format(keyValueVariables));
    } catch (error) {
      console.log(error);
    }
  }, [variables]);

  return (
    <Stack>
      <Text>
        {t('testVariables')}
      </Text>

      <Accordion order={4}>
        {items}
      </Accordion>

      <Text>
        {t('livePreview')}
      </Text>
      <Text>
        {'preview\r'}
      </Text>
    </Stack>
  );
};

export default TestVariables;
