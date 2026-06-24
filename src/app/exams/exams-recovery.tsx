import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { StudentRouteRecovery } from "@/components/student-route-recovery";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

interface ExamsRecoveryContentProps {
  title: string;
  description: string;
}

export function ExamsRecoveryContent({ title, description }: ExamsRecoveryContentProps) {
  return (
    <StudentRouteRecovery
      eyebrow="Exam recovery"
      title={title}
      description={description}
      actions={[
        { href: "/saved-progress", label: "Open saved progress", variant: "primary" },
        { href: "/dashboard", label: "Return to dashboard", variant: "secondary" },
        { href: "/support", label: "Support hub", variant: "secondary" },
      ]}
    />
  );
}

export async function ExamsRecoveryInShell({
  title,
  description,
}: ExamsRecoveryContentProps) {
  const shell = await requireStudentAppRouteContext();

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <ExamsRecoveryContent title={title} description={description} />
    </StudentAppShell>
  );
}
