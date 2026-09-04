import { Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';

import { elementsConfig } from './elementProps';
import { getMarkAttributes } from '@/shared/lib/icu';
import MarkActions from '../MarkActions/MarkActions';
import type { MarkComponentConfig } from './elementProps';

type Props = {
  children: ReactNode;
  tiptapMark: MarkViewRendererProps;
};
const MarkRenderer = ({ children, ...props }: Props) => {
  const attrs = getMarkAttributes(props.tiptapMark);
  const markType = attrs['data-mark-type'];
  // @ts-expect-error
  const markConfig = elementsConfig?.[markType] as MarkComponentConfig;
  const classes = markConfig?.classes?.({ markAttributes: attrs });

  if (markConfig?.withActions) {
    return (
      <MarkActions tiptapMark={props.tiptapMark}>
        {({ ref, children: _, className: __, ...otherProps }) => (
          <Text
            span
            ref={ref}
            className={classes}
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
      className={classes}
      attributes={{ root: attrs }}
    >
      {children}
    </Text>
  );
};

export default MarkRenderer;
