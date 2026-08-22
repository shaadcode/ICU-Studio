import { Badge, Paper, Stack, Title } from '@mantine/core';

import classes from './TemplateBox.module.css';
import type { ICUTemplate } from '@/pages/landing/model/icuTemplates';

type Props = {
  data: ICUTemplate;
  onClick?: (data: ICUTemplate) => void;
  onClickCategory?: (category: ICUTemplate['category']) => void;
};

const TemplateBox = (props: Props) => {
  return (
    <Paper
      withBorder
      className={classes['paperContainer']}

      onClick={() => props.onClick?.(props.data)}
    >
      <Stack>
        <Title order={5} className={classes['title']}>{props.data.name}</Title>
        <Badge
          size="sm"
          color="green"
          variant="light"

          onClick={() => props.onClickCategory?.(props.data.category)}
        >
          {props.data.category}
        </Badge>
      </Stack>
    </Paper>
  );
};

export default TemplateBox;
