import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { DashboardHome } from "./dashboard-home";
import { baseDashboardHomeData } from "../../.storybook/story-fixtures";

const meta = {
  component: DashboardHome,
  tags: ["ai-generated", "needs-work"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DashboardHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeMode: Story = {
  args: {
    data: baseDashboardHomeData,
    mode: "home",
  },
};

export const DashboardMode: Story = {
  args: {
    data: {
      ...baseDashboardHomeData,
      recommendedAction: "Review the English assessment before reopening the maths paper.",
    },
    mode: "dashboard",
  },
};

export const CssCheck: Story = {
  args: {
    data: baseDashboardHomeData,
    mode: "home",
  },
  play: async ({ canvas }) => {
    const primaryLink = canvas.getByRole("link", { name: /open student dashboard/i });
    await expect(getComputedStyle(primaryLink).backgroundColor).toBe("rgb(15, 118, 110)");
  },
};
