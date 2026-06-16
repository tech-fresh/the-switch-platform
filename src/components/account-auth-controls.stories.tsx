import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccountAuthControls } from "./account-auth-controls";

const meta = {
  component: AccountAuthControls,
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof AccountAuthControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
  args: {
    isAuthenticated: false,
    signInOptions: [
      {
        provider: "email-magic-link",
        label: "Email magic link",
        description: "Fast sign in for students without a password-first flow.",
      },
      {
        provider: "google",
        label: "Google",
        description: "Editorial and staff sign in for protected routes.",
      },
    ],
  },
};

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    signInOptions: [],
  },
};
