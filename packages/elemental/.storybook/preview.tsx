import type { Preview } from "@storybook/react";
import "../src/sass/global.scss";
import "./preview.scss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#fff"},
        { name: "dark", value: "#000"},
        { name: "red", value: "#f00"}
      ]
    },
    options: {
      storySort: {
        order: ['Getting Started', 'Styles', 'Atoms', 'Components'],
      },
    },
  },
};

export default preview;
