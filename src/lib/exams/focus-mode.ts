/** Exam route focus mode — lobby uses StudentAppShell; active papers do not. */
export function isExamFocusMode(searchParams?: {
  examId?: string;
  questionId?: string;
  focus?: string;
}): boolean {
  if (!searchParams?.examId) {
    return false;
  }

  return searchParams.focus === "1" || Boolean(searchParams.questionId);
}

export function buildExamFocusHref(examId: string, questionId?: string): string {
  const params = new URLSearchParams({ examId, focus: "1" });
  if (questionId) {
    params.set("questionId", questionId);
  }

  return `/exams?${params.toString()}`;
}

export function buildExamLobbyHref(examId?: string): string {
  if (!examId) {
    return "/exams";
  }

  return `/exams?examId=${encodeURIComponent(examId)}`;
}
