import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const path = require("path")

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    '@storybook/addon-docs',
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      publicDir: false, // Disable automatic copying of public folder
      resolve: {
        alias: {
          'assets': path.resolve(__dirname, '../src/assets'),
          'atoms': path.resolve(__dirname, '../src/atoms'),
          'components': path.resolve(__dirname, '../src/components'),
          'sass': path.resolve(__dirname, '../src/sass'),
          'utils': path.resolve(__dirname, '../src/utils'),
          'hooks': path.resolve(__dirname, '../src/hooks'),
          '@birdeye': path.resolve(__dirname, '../../../src/app'),
        },
      },
      server: {
        allowedHosts: ['storybook-elemental.birdeye.com'],
      },
    });
  },
};

export default config;
