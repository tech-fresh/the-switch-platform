import assert from "node:assert/strict";
import test from "node:test";

test("student navigation stays on the five streamlined MVP destinations", async () => {
  const { STUDENT_NAV_ITEMS, MOBILE_NAV_ITEMS } = await import("../src/components/mock-idea/brand-tokens.ts");

  assert.deepEqual(
    STUDENT_NAV_ITEMS.map((item) => ({ href: item.href, label: item.label })),
    [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/subjects", label: "Subjects" },
      { href: "/exams", label: "Exams" },
      { href: "/progress", label: "Progress" },
      { href: "/account", label: "Profile" },
    ],
  );

  assert.equal(MOBILE_NAV_ITEMS.length, 5);
  assert.equal(
    STUDENT_NAV_ITEMS.some((item) => item.label === "Practice" || item.label === "Planner" || item.label === "Power Grid"),
    false,
  );
});
