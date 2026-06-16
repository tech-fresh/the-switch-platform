import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { AccessibilityExperience } from "./accessibility-experience";
import {
  baseAccessibilitySnapshot,
  baseReadAloudSession,
  baseRecommendations,
  baseSupportHubData,
} from "../../../.storybook/story-fixtures";

const meta = {
  component: AccessibilityExperience,
  tags: ["ai-generated", "needs-work"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AccessibilityExperience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSupport: Story = {
  args: {
    snapshot: baseAccessibilitySnapshot,
    readAloudSession: baseReadAloudSession,
    recommendations: baseRecommendations,
    support: baseSupportHubData,
  },
};

export const StudentPreferenceMode: Story = {
  args: {
    snapshot: {
      ...baseAccessibilitySnapshot,
      settings: {
        ...baseAccessibilitySnapshot.settings,
        focusModeEnabled: false,
        reducedDistractionModeEnabled: false,
        textToSpeechEnabled: true,
      },
      studentAccessProfile: {
        ...baseAccessibilitySnapshot.studentAccessProfile,
        activeAccessArrangements: [],
        textToSpeechEnabled: true,
      },
    },
    readAloudSession: {
      ...baseReadAloudSession,
      speed: 1,
    },
    recommendations: baseRecommendations,
    support: baseSupportHubData,
  },
};

export const SaveSettings: Story = {
  args: {
    snapshot: baseAccessibilitySnapshot,
    readAloudSession: baseReadAloudSession,
    recommendations: baseRecommendations,
    support: baseSupportHubData,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /save support settings/i }));
    await expect(
      await canvas.findByText(/saved to the accessibility, access-profile, and read-aloud preference layer/i),
    ).toBeVisible();
  },
};
