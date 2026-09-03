import { Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './ArgumentNameDelimiterStart.module.css';

type Props = {
  children: ReactNode;
  view: MarkViewRendererProps;
};
const ArgumentNameDelimiterStartMark = ({ children, ...props }: Props) => {
  const mark = props.view.mark;
  const { class: className, ...otherAttrs } = mark.attrs;

  return (
    <Text span className={classes['root']} {...otherAttrs}>
      {children}
    </Text>
  );
};

export default ArgumentNameDelimiterStartMark;
