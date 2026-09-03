import { Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './OffsetColon.module.css';

type Props = {
  children: ReactNode;
  tiptap: MarkViewRendererProps;
};
const OffsetColonMark = ({ children }: Props) => {
  return (
    <Text span className={classes['root']}>
      {/* # */}
      {children}
    </Text>
  );
};

export default OffsetColonMark;
