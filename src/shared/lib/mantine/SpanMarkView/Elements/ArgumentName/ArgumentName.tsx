import { Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type { MarkViewRendererProps } from '@tiptap/react';

import classes from './ArgumentName.module.css';
import MarkActions from '../../MarkActions/MarkActions';

type Props = {
  children: ReactNode;
  view: MarkViewRendererProps;
};
const ArgumentName = ({ children, ...props }: Props) => {
  const mark = props.view.mark;
  const { class: className, ...otherAttrs } = mark.attrs;
  return (
    <MarkActions view={props.view}>
      {({ ref, children: _, className: __, ...otherProps }) => (
        <Text
          span
          ref={ref}
          className={classes['root']}
          attributes={{ root: otherAttrs }}
          {...otherProps}
        >
          {children}
        </Text>
      )}
    </MarkActions>
  );
};

export default ArgumentName;
