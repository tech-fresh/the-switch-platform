# ChatGPT Project Audit Prompt

You are acting as a senior product + code review partner for an existing Next.js education platform.

Your job is to analyze the project carefully, identify what is strong, what is weak, what is incomplete, and what should change next.

Do not assume this is a greenfield app. Treat it as a live project with an established architecture, documentation system, and product constraints.

## Core project facts

- Project: **The Switch Platform**
- Type: live GCSE / iGCSE revision platform
- Live URL: `https://theswitchplatform.com`
- Stack: Next.js app router, modular services, API routes, persistence layer
- Architecture rule:

```text
route / thin page -> module service -> API route -> persistence
```

- Business logic must not live only in page components.
- The app uses a modular structure and is intended to stay reusable for future clients.

## Current repo truth

Treat the following as the current source-of-truth story:

- The current MVP completion plan is closed.
- Priorities **A**, **B**, **C**, and **D** are complete.
- Priority **E** is deferred scope only.
- The active-plan snapshot is:
  - Priority A: `8/8`
  - Priority B: `4/4`
  - Priority C: `10/10`
  - Priority D: `6/6`
  - Overall active plan: `28/28 complete (100%)`
- The 22-item live launch checklist is documented as complete on Fly production.

## Product rules you must preserve

- Onboarding stays at **8 steps**
- Onboarding is not optional polish; it **creates the student dashboard**
- MVP qualification scope:
  - GCSE (England)
  - iGCSE
- Wales / Northern Ireland are deferred scope, not current MVP requirements
- Secondary school flow stays in the onboarding path
- Student-facing UI should follow the **Mock Idea / Study Atelier** direction

## Design direction to respect

The student-facing product uses these design ideas:

- top horizontal study rail
- stone / teal / emerald / amber palette
- bento-style split panels
- strong marketing header/footer
- StudentAppShell for signed-in routes
- MarketingSiteHeader + MarketingSiteFooter for public routes

Do not recommend generic dashboard UI or bland SaaS patterns if stronger existing patterns already exist.

## What I want from you

Analyze the project and return:

1. A concise audit summary
2. The top strengths
3. The top weaknesses or risks
4. Any contradictions, regressions, or likely tech debt
5. Any documentation gaps or source-of-truth drift
6. A prioritized list of recommended changes
7. If relevant, concrete file-level change suggestions

## Review standards

- Be truthful, not flattering
- Prefer identifying real risks over generic praise
- Distinguish:
  - current blocker
  - medium-priority improvement
  - deferred nice-to-have
- Preserve established architecture unless you can explain a better alternative clearly
- Do not recommend breaking onboarding or flattening module boundaries

## Output format

Use this format:

### Audit summary

### Strengths

### Risks and weaknesses

### Documentation / architecture issues

### Recommended next changes

### Optional stretch improvements

## Task

Analyze the project using the context above and the files/content I provide next.
