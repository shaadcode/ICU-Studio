import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';
import { Text, useComputedColorScheme } from '@mantine/core';

import { elementsConfig } from './elementProps';
import { getMarkViewAttributes } from '@/shared/lib/icu';
import type { MarkComponentConfig } from './elementProps';
import VariableActions from '../MarkActions/VariableActions';

type Props = {
  children: ReactNode;
  tiptapMark: MarkViewRendererProps;
};
const MarkRenderer = ({ children, ...props }: Props) => {
  const attrs = getMarkViewAttributes(props.tiptapMark);
  const colorScheme = useComputedColorScheme('light');
  const markType = attrs['data-mark-type'];
  // @ts-expect-error
  const markConfig = elementsConfig?.[markType] as MarkComponentConfig;
  const styles = markConfig?.style?.({
    colorScheme,
    markAttributes: attrs,
  });

  if (markConfig?.withActions) {
    return (
      <VariableActions
        eventTrigger="contextMenu"
        editor={props.tiptapMark.editor}
        referenceId={attrs['data-reference-id']}
        elementType={attrs['data-variable-type']}
      >
        {({ ref, children: _, className: __, ...otherProps }) => (
          <Text
            span
            ref={ref}
            style={styles}
            attributes={{ root: attrs }}
            {...otherProps}
          >
            {children}
          </Text>
        )}
      </VariableActions>
    );
  }
  return (
    <Text
      span
      style={styles}
      attributes={{ root: attrs }}
    >
      {children}
    </Text>
  );
};

export default MarkRenderer;
