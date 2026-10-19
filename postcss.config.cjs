/* eslint-disable perfectionist/sort-objects */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        /** Suitable for small mobile phones (portrait) */
        'mantine-breakpoint-xs': '36em',

        /** Suitable for tablets (portrait) and large mobile phones */
        'mantine-breakpoint-sm': '48em',

        /** Suitable for tablets (landscape) and small laptops */
        'mantine-breakpoint-md': '62em',

        /** Suitable for standard laptops and desktop monitors */
        'mantine-breakpoint-lg': '75em',

        /** Suitable for large monitors and ultra-wide displays */
        'mantine-breakpoint-xl': '88em',
      },
    },
    'autoprefixer': {},
  },
};
