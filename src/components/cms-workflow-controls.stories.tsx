import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse } from "msw";
import { expect } from "storybook/test";
import { CmsWorkflowControls } from "./cms-workflow-controls";

const meta = {
  component: CmsWorkflowControls,
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof CmsWorkflowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QueuedReview: Story = {
  args: {
    contentId: "maths-algebra",
    note: "Needs a quick editorial pass before approval.",
    status: "queued-review",
    owner: "Jordan Adebayo",
  },
};

export const SaveError: Story = {
  args: {
    contentId: "maths-algebra",
    note: "Fact-checking can continue after the next source review.",
    status: "fact-check",
    owner: "Jordan Adebayo",
  },
  parameters: {
    msw: {
      handlers: [
        http.patch("/api/cms/workflow/:contentId", () =>
          HttpResponse.json({ error: "Editorial workflow update failed." }, { status: 500 }),
        ),
      ],
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /save workflow step/i }));
    await expect(await canvas.findByText(/editorial workflow update failed/i)).toBeVisible();
  },
};
