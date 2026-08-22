import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'yellow',
  fontFamily: 'montserrat',
  headings: {
    fontFamily: 'montserrat',
  },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  colors: {
    red: [
      '#ffe7ed',
      '#ffced7',
      '#ff9bac',
      '#ff637d',
      '#fe3758',
      '#fe1b3f',
      '#ff0932',
      '#e40025',
      '#cc0020',
      '#b20019',
    ],
    green: [
      '#e5fff8',
      '#d0fff0',
      '#9ffedf',
      '#6dfece',
      '#48febf',
      '#35feb6',
      '#28feb1',
      '#1ae29a',
      '#00d28e',
      '#00ae73',
    ],
    yellow: [
      '#fff9e1',
      '#fff2cb',
      '#ffe49a',
      '#ffd564',
      '#ffc838',
      '#ffc01c',
      '#fcb700',
      '#e3a500',
      '#ca9200',
      '#af7d00',
    ],
  },
});
