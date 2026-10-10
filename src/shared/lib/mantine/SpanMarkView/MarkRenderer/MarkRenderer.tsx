import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';
import { Text, useComputedColorScheme } from '@mantine/core';

import { elementsConfig } from './elementProps';
import MarkActions from '../MarkActions/MarkActions';
import { getMarkViewAttributes } from '@/shared/lib/icu';
import type { MarkComponentConfig } from './elementProps';

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
      <MarkActions tiptapMark={props.tiptapMark}>
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
      </MarkActions>
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
