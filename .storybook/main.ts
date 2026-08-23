import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-designs',
    'storybook-addon-pseudo-states',
    'storybook-addon-test-codegen',
    '@storybook/addon-themes',
    '@github-ui/storybook-addon-performance-panel',
  ],
};
export default config;
