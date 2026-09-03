import { Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './Stem.module.css';

type Props = {
  children: ReactNode;
  tiptap: MarkViewRendererProps;
};
const StemMark = ({ children }: Props) => {
  return (
    <Text span className={classes['root']}>
      {children}
    </Text>
  );
};

export default StemMark;
