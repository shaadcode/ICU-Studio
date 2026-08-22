import antfu from '@antfu/eslint-config';

const ignoreFiles = [
  './README.md',
  'node_modules/**/*',
];
export default antfu(
  {
    jsonc: true,
    react: true,
    typescript: true,
    isInEditor: false,
    // Ignored paths
    ignores: ignoreFiles,

    // Configuration preferences
    lessOpinionated: true,
    // Format settings
    formatters: {
      css: true,
    },
    // Code style
    stylistic: {
      semi: true,
    },
  },
  // --- Custom Rule Overrides ---
  {
    rules: {
      // 'style/jsx-sort-props': ['error', { multiline: 'last' }],
      'dot-notation': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      'ts/ban-ts-comment': 'off',
      'antfu/imports/order': 'off',
      'style/jsx-sort-props': ['off'],
      'antfu/no-top-level-await': 'off', // Allow top-level await
      // 'node/prefer-global/process': 'off', // Allow using `process.env`
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
      'react/jsx-no-children-prop': 'error',
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
      'style/jsx-curly-brace-presence': [
        'error',
        {
          props: 'ignore',
          children: 'always',
        },
      ],
      'perfectionist/sort-maps': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-modules': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-exports': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],

      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-interfaces': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-union-types': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-object-types': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-named-exports': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-named-imports': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-variable-declarations': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          type: 'line-length',
          partitionByNewLine: false,
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          order: 'asc',
          type: 'line-length',
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          order: 'asc',
          ignoreCase: true,
          newlinesBetween: 1,

          type: 'line-length',
          groups: [
            // 'shorthand',
            'prop',
            'navigation-props',
            'callback',
            // 'multiline',
          ],
          customGroups: [
            {
              type: 'line-length',
              groupName: 'callback',
              elementNamePattern: '^on[A-Z].*',
            },
            {
              type: 'line-length',
              groupName: 'navigation-props',
              elementNamePattern: [
                { pattern: 'href' },
                { pattern: 'params' },
                { pattern: 'queries' },
              ],
            },
          ],
        },
      ],
    },
  },
);
