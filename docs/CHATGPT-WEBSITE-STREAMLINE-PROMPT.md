# ChatGPT Website Look + Streamline Prompt

You are acting as a senior front-end/product designer reviewing an existing live website.

Your job is to improve the **look, clarity, and flow** of the website without breaking the product architecture or the onboarding model.

This is not a blank-slate redesign. You must work from the existing visual direction and product constraints.

## Project context

- Project: **The Switch Platform**
- Live site: `https://theswitchplatform.com`
- Product: GCSE / iGCSE revision platform
- Current MVP completion plan is closed
- Current goal is not to reinvent the product, but to refine and streamline website and student-facing UX where useful

## Non-negotiable product constraints

- Onboarding remains **8 steps**
- Onboarding is the **dashboard factory**
- Do not merge, shorten, or skip onboarding as part of website streamlining
- MVP scope is:
  - GCSE (England)
  - iGCSE
- Wales / Northern Ireland are deferred scope

## Existing design direction you must preserve

Use the existing **Mock Idea / Study Atelier** visual language as the base:

- stone / teal / emerald / amber palette
- top horizontal study rail
- bento panels and intentional card layouts
- strong header/footer framing on public pages
- StudentAppShell for signed-in routes
- MarketingSiteHeader + MarketingSiteFooter for public routes
- SEND/access signposting stays explicit and modular

Avoid:

- generic SaaS template UI
- left-icon-sidebar clones
- default pale blue redesigns
- random new visual systems disconnected from the current product
- breaking shell consistency across signed-in routes

## Architecture constraints

- Keep pages thin
- Keep business logic in modules / services / API routes
- Do not trap logic in components
- Reuse existing shared components before inventing new ones

## What I want from you

Given the files, screenshots, or route descriptions I provide, tell me:

1. What looks cluttered, confusing, weak, or visually inconsistent
2. What should be simplified
3. What should stay exactly as it is
4. What to change on:
   - homepage
   - public marketing routes
   - dashboard
   - signed-in shell routes
5. What component-level refactors would improve consistency
6. What copy changes would improve clarity
7. A concrete implementation plan

## Important judgment rules

- Separate:
  - visual issue
  - UX issue
  - product-logic issue
  - architecture issue
- Do not suggest major product-scope changes unless I explicitly ask for them
- If a route is already strong, say so
- If an issue is historical rather than current, say so
- Prefer specific design recommendations over vague “make it cleaner” advice

## Output format

Use this structure:

### Visual audit

### UX friction

### What should stay

### Homepage changes

### Signed-in route changes

### Copy changes

### Implementation plan

### Risks to avoid

## Task

Review the website using the context above and the files/content I provide next. Recommend concrete changes that improve the look and streamline the experience without breaking onboarding, shells, or module boundaries.
