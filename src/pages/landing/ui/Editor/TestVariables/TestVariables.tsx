import React from 'react';
import { useTranslations } from 'use-intl';
import { Text, Stack, Accordion } from '@mantine/core';
import type { TYPE } from '@formatjs/icu-messageformat-parser';

import { icuEditorStore } from '@/pages/landing/config/store';
import TestSimpleVariableField from './Elements/SimpleVariable/SimpleVariable';

const TestVariables = () => {
  const t = useTranslations('editor');
  const variables = icuEditorStore.use.variables() ?? [];
  //   const variablesValues = icuEditorStore.use.variablesValues();
  //   const _parsedMessage = icuEditorStore.use.parsedMessage() ?? [];
  //   const formatter = new IntlMessageFormat(`{count, plural,
  //   =0 {No files selected}
  //   one {1 file selected}
  //   other {# files selected}
  // }`).format({ count: '1' });

  const items = variables.map((element, i) => {
    const [_variableName, enumType] = element;
    const components: Record<`${TYPE}`, () => React.JSX.Element> = {
      0: () => <></>,
      2: () => <></>,
      3: () => <></>,
      4: () => <></>,
      5: () => <></>,
      6: () => <></>,
      7: () => <></>,
      8: () => <></>,
      1: () => <TestSimpleVariableField data={element} />,

    };

    const Component = components[enumType];

    return <Component key={i} />;
  });

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
