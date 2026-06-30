import process from "node:process";
import { pathToFileURL } from "node:url";

import { STUDENT_SHELL_ROUTE_PATHS } from "./canonical-mvp-routes.mjs";
import { ensureWalkthroughStudentOnboardingComplete, jsonHeaders } from "./live-onboarding-utils.mjs";
import { assert, ensureBuild, fetchJson, fetchText, getSessionCookie, startNextServer, stopServer } from "./launch-utils.mjs";

const EXAM_ID = "aqa-maths-higher-paper-1";

export async function runLaunchE2e() {
  await ensureBuild();

  const server = await startNextServer({
    SWITCH_AUTH_MODE: "preview-cookie",
    SWITCH_AUTH_SECRET: "launch-e2e-secret",
  });

  try {
    const studentCookie = await signIn(server.baseUrl, "email-magic-link", "/account");
    const adminCookie = await signIn(server.baseUrl, "google", "/admin");
    const studentHeaders = jsonHeaders({ cookie: studentCookie });

    await ensureWalkthroughStudentOnboardingComplete(server.baseUrl, studentHeaders);

    const studentAccount = await fetchJson(`${server.baseUrl}/api/account/overview`, {
      headers: studentHeaders,
    });
    assert(studentAccount.response.ok, `Expected student account overview to return 200, received ${studentAccount.response.status}.`);
    assert(studentAccount.json?.account?.isAuthenticated === true, "Expected student account overview to report an authenticated session.");

    const studentResults = await fetchJson(`${server.baseUrl}/api/results/overview`, {
      headers: studentHeaders,
    });
    assert(studentResults.response.ok, `Expected authenticated /api/results/overview to return 200, received ${studentResults.response.status}.`);

    const adminAccount = await fetchJson(`${server.baseUrl}/api/account/overview`, {
      headers: {
        cookie: adminCookie,
      },
    });
    assert(adminAccount.response.ok, `Expected admin account overview to return 200, received ${adminAccount.response.status}.`);
    assert(
      adminAccount.json?.account?.session?.user?.roles?.includes("admin") === true,
      "Expected the admin session to include the admin role.",
    );

    const accountPage = await fetchText(`${server.baseUrl}/account`, {
      headers: studentHeaders,
    });
    assert(
      accountPage.body.includes("Your signed-in identity and study shortcuts"),
      "Expected signed-in account page copy to render for the student session.",
    );

    for (const route of [...STUDENT_SHELL_ROUTE_PATHS, "/support", "/how-it-works"]) {
      const page = await fetchText(`${server.baseUrl}${route}`, {
        headers: studentHeaders,
      });

      assert(page.response.ok, `Expected authenticated ${route} to return 200, received ${page.response.status}.`);
      assert(
        page.body.includes('aria-label="Student navigation"') || route === "/support" || route === "/how-it-works",
        `Expected authenticated ${route} to render the student shell or public marketing surface.`,
      );
    }

    const focusedExamPage = await fetchText(
      `${server.baseUrl}/exams?examId=${EXAM_ID}&questionId=q1-v1`,
      {
        headers: studentHeaders,
      },
    );
    assert(
      focusedExamPage.response.ok,
      `Expected focused exam route to return 200, received ${focusedExamPage.response.status}.`,
    );
    assert(
      focusedExamPage.body.includes("Question navigator") ||
        focusedExamPage.body.includes("Resume full paper practice") ||
        focusedExamPage.body.includes("Exam focus mode"),
      "Expected focused exam route to render exam-session controls.",
    );

    const focusedAssessmentPage = await fetchText(
      `${server.baseUrl}/assessments?assessmentId=edexcel-english-writing-craft-checkpoint&durationMinutes=30&questionId=q4`,
      {
        headers: studentHeaders,
      },
    );
    assert(
      focusedAssessmentPage.response.ok,
      `Expected focused assessment route to return 200, received ${focusedAssessmentPage.response.status}.`,
    );
    assert(
      focusedAssessmentPage.body.includes("Checkpoint") ||
        focusedAssessmentPage.body.includes("Question navigator") ||
        focusedAssessmentPage.body.includes("Timed assessment"),
      "Expected focused assessment route to render timed-practice controls.",
    );

    const examSessionResponse = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, {
      headers: studentHeaders,
    });
    assert(examSessionResponse.response.ok, `Expected exam session API to return 200, received ${examSessionResponse.response.status}.`);

    const examSession = examSessionResponse.json?.session;
    assert(examSession?.examSessionId, "Expected exam session payload for save/resume rehearsal.");

    const answeredResponses = examSession.questionResponses.map((response, index) =>
      index === 0
        ? { ...response, status: "answered", selectedOptionId: response.selectedOptionId ?? "a" }
        : response,
    );

    const examSave = await fetchJson(`${server.baseUrl}/api/exams/session/${EXAM_ID}`, {
      method: "PATCH",
      headers: studentHeaders,
      body: JSON.stringify({
        examSessionId: examSession.examSessionId,
        currentQuestionId: examSession.questions[0].questionId,
        questionResponses: answeredResponses,
        timeRemainingMinutes: 42,
      }),
    });
    assert(examSave.response.ok, `Expected exam autosave to return 200, received ${examSave.response.status}.`);

    const savedProgressAfterSave = await fetchJson(`${server.baseUrl}/api/saved-progress/overview`, {
      headers: studentHeaders,
    });
    assert(savedProgressAfterSave.response.ok, "Expected saved-progress overview after exam save.");
    const examSavedSession = savedProgressAfterSave.json?.overview?.sessions?.find(
      (entry) => entry.entityType === "exam-session" && entry.entityId === examSession.examSessionId,
    );
    assert(examSavedSession?.href, "Expected saved exam session to expose a resume href.");

    const examResumePage = await fetchText(`${server.baseUrl}${examSavedSession.href}`, {
      headers: studentHeaders,
    });
    assert(
      examResumePage.response.ok,
      `Expected exam resume href ${examSavedSession.href} to return 200.`,
    );

    const adminPage = await fetchText(`${server.baseUrl}/admin`, {
      headers: {
        cookie: adminCookie,
      },
    });
    assert(adminPage.response.ok, `Expected authenticated /admin to return 200, received ${adminPage.response.status}.`);
    assert(adminPage.response.url.endsWith("/admin"), `Expected authenticated /admin to stay on /admin, received ${adminPage.response.url}.`);

    const cmsOverview = await fetchJson(`${server.baseUrl}/api/cms/overview`, {
      headers: {
        cookie: adminCookie,
      },
    });
    assert(cmsOverview.response.ok, `Expected authenticated /api/cms/overview to return 200, received ${cmsOverview.response.status}.`);
    assert(cmsOverview.json?.overview, "Expected authenticated CMS overview response to include overview data.");

    const signOutResponse = await fetchJson(`${server.baseUrl}/api/auth/session`, {
      method: "DELETE",
      headers: {
        origin: server.baseUrl,
        cookie: studentCookie,
      },
    });
    assert(signOutResponse.response.ok, `Expected sign-out to return 200, received ${signOutResponse.response.status}.`);
    assert(signOutResponse.json?.session?.status === "signed-out", "Expected sign-out response to report a signed-out session.");
    assert(
      (signOutResponse.response.headers.get("set-cookie") ?? "").includes("switch_auth_session="),
      "Expected sign-out to clear the auth session cookie.",
    );

    const signedOutResults = await fetchJson(`${server.baseUrl}/api/results/overview`, {});
    assert(signedOutResults.response.status === 401, `Expected signed-out /api/results/overview to return 401, received ${signedOutResults.response.status}.`);

    console.log(
      "Local end-to-end rehearsal passed: student routes, exam autosave/resume, admin access, protected APIs, and sign-out all behaved correctly in the preview-style test runtime.",
    );
  } finally {
    await stopServer(server.child);
  }
}

async function signIn(baseUrl, provider, returnTo) {
  const response = await fetch(
    `${baseUrl}/api/auth/start?provider=${encodeURIComponent(provider)}&returnTo=${encodeURIComponent(returnTo)}`,
    {
      redirect: "manual",
    },
  );

  assert(response.status >= 300 && response.status < 400, `Expected sign-in start for ${provider} to redirect, received ${response.status}.`);

  const cookies = response.headers.getSetCookie();

  return getSessionCookie(cookies);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runLaunchE2e();
}
