import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppPreviewShowcase } from "./app-preview-showcase";
import {
  baseDashboardHomeData,
  basePowerGridSummary,
  baseSubjects,
} from "../../.storybook/story-fixtures";

const meta = {
  component: AppPreviewShowcase,
  tags: ["ai-generated", "needs-work"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppPreviewShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BalancedSignals: Story = {
  args: {
    dashboardData: baseDashboardHomeData,
    summary: basePowerGridSummary,
    subjects: baseSubjects,
  },
};

export const AttentionNeeded: Story = {
  args: {
    dashboardData: {
      ...baseDashboardHomeData,
      recommendedAction: "Reduce the number of top-level choices until science confidence stabilises.",
    },
    summary: {
      ...basePowerGridSummary,
      overallTrend: "declining",
      examReadinessScore: 49,
      nextBestAction: "Protect attention by reopening one saved route and cutting route switching.",
    },
    subjects: baseSubjects.map((subject) =>
      subject.subjectId === "gcse-combined-science"
        ? { ...subject, examReadinessScore: 39, nextTopicToRevise: "Chemical Changes" }
        : subject,
    ),
  },
};
