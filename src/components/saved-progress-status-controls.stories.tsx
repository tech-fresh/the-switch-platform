import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse } from "msw";
import { expect } from "storybook/test";
import { SavedProgressStatusControls } from "./saved-progress-status-controls";

const meta = {
  component: SavedProgressStatusControls,
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof SavedProgressStatusControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResumeReady: Story = {
  args: {
    entityId: "aqa-maths-higher-paper-1",
    entityType: "exam-session",
    recoveryState: "resume-ready",
    status: "in-progress",
  },
};

export const UpdateError: Story = {
  args: {
    entityId: "aqa-maths-higher-paper-1",
    entityType: "exam-session",
    recoveryState: "resume-ready",
    status: "paused",
  },
  parameters: {
    msw: {
      handlers: [
        http.patch("/api/saved-progress/session/:entityType/:entityId", () =>
          HttpResponse.json(
            { error: "Saved progress status could not be updated." },
            { status: 500 },
          ),
        ),
      ],
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /mark ready to resume/i }));
    await expect(
      await canvas.findByText(/saved progress status could not be updated/i),
    ).toBeVisible();
  },
};
