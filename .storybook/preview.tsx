import type { Preview } from "@storybook/nextjs-vite";
import MockDate from "mockdate";
import { initialize, mswLoader } from "msw-storybook-addon";
import "../src/app/globals.css";
import { mswHandlers } from "./msw-handlers";

initialize({ onUnhandledRequest: "bypass" });

function applyAccessibilityBaseline() {
  const root = document.documentElement;
  const body = document.body;

  root.lang = "en";
  root.dataset.switchColourScheme = "default";
  root.dataset.switchHighContrast = "false";
  root.dataset.switchFocusMode = "false";
  root.dataset.switchReducedDistraction = "false";
  root.dataset.switchDyslexiaFont = "false";
  root.style.fontSize = "16px";
  root.style.setProperty("--switch-line-height", "1.6");
  body.style.lineHeight = "1.6";
}

const preview: Preview = {
  decorators: [
    (Story) => {
      applyAccessibilityBaseline();

      return <Story />;
    },
  ],
  loaders: [mswLoader],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: mswHandlers,
    },
    a11y: {
      test: "todo",
    },
  },
  async beforeEach() {
    MockDate.set("2026-06-15T12:00:00Z");
    applyAccessibilityBaseline();
  },
};

export default preview;
