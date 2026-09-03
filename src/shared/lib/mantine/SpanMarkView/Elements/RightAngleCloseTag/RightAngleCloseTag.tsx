import { Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './RightAngleCloseTag.module.css';

type Props = {
  children: ReactNode;
  tiptap: MarkViewRendererProps;
};
const RightAngleCloseTagMark = ({ children }: Props) => {
  return (
    <Text span className={classes['root']}>
      {children}
    </Text>
  );
};

export default RightAngleCloseTagMark;
