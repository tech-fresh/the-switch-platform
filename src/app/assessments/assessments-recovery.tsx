import { StudentAppShell } from "@/components/mock-idea/student-app-shell";
import { StudentRouteRecovery } from "@/components/student-route-recovery";
import { requireStudentAppRouteContext } from "@/lib/server/student-route";

interface AssessmentsRecoveryContentProps {
  title: string;
  description: string;
}

export function AssessmentsRecoveryContent({ title, description }: AssessmentsRecoveryContentProps) {
  return (
    <StudentRouteRecovery
      eyebrow="Timed practice recovery"
      title={title}
      description={description}
      actions={[
        { href: "/assessments", label: "Open practice lobby", variant: "primary" },
        { href: "/saved-progress", label: "Open saved progress", variant: "secondary" },
        { href: "/dashboard", label: "Return to dashboard", variant: "secondary" },
      ]}
    />
  );
}

export async function AssessmentsRecoveryInShell({
  title,
  description,
}: AssessmentsRecoveryContentProps) {
  const shell = await requireStudentAppRouteContext();

  return (
    <StudentAppShell displayName={shell.displayName} supportChips={shell.supportChips}>
      <AssessmentsRecoveryContent title={title} description={description} />
    </StudentAppShell>
  );
}
