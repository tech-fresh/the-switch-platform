# The Switch Platform — UI/UX Master Guide (MVP)

**Version:** Mark 4.0  
**Status:** MVP design standard  
**Purpose:** Single source of truth for the streamlined MVP user experience and visual direction.

---

## 1. Vision

Build a GCSE revision platform that is professional, vibrant, accessible, fast, simple, and motivating.

The Switch Platform should combine the strongest lessons from leading education and product experiences without copying any one of them:

- **Seneca** — learning flow and adaptive quizzes.
- **Duolingo** — motivation and positive reinforcement.
- **Linear** — premium UI and navigation.
- **Stripe** — layout, spacing, and polish.
- **Apple** — typography and simplicity.
- **Notion** — organisation and information hierarchy.
- **BBC Bitesize** — educational clarity.
- **Save My Exams** — exam content structure.

The final experience should feel unmistakably like The Switch Platform: calm, premium, vibrant, uncluttered, and focused on helping students revise effectively.

---

## 2. Core Principles

- One primary action per screen.
- One purpose per page.
- Maximum three clicks to any core feature.
- Show only what the student needs right now.
- Use progressive disclosure for advanced features.
- Mobile-first.
- Accessibility by default.
- Reusable components only.
- No duplicate information.
- Every feature must support learning.

Every screen should answer one student question:

> What is the next best thing for me to do right now?

---

## 3. Site Architecture

### Public

- Landing
- Pricing
- About
- Contact
- Login
- Sign Up

### Student

- Dashboard
- Subjects
- Exams
- Progress
- Profile

### Admin

- CMS
- Content
- Users
- Reports

### Future, not MVP

- AI Tutor
- AI Study Coach
- AI Question Generator
- AI Essay Marking
- Parent Portal
- Teacher Portal
- Study Groups
- Leaderboards

AI is a future project and should not sit in the MVP navigation or dashboard until it is needed and properly designed, tested, safeguarded, and resourced.

---

## 4. Navigation

Primary navigation:

1. Dashboard
2. Subjects
3. Exams
4. Progress
5. Profile

Everything else belongs inside these sections. Practice sits inside Subjects because students naturally think by subject first.

Remove from top-level navigation:

- Practice as a separate item.
- Settings.
- Accessibility.
- Saved Progress.
- Read Aloud.
- Recommendations.
- AI Tutor.

These should be automatic, contextual, or inside Profile / Subjects / Progress.

---

## 5. Landing Page

Recommended order:

1. Hero.
2. Benefits.
3. GCSE subjects.
4. How it works.
5. Student success.
6. Pricing.
7. FAQ.
8. Footer.

Primary call to action:

> Start Learning Free

The landing page should feel polished and premium but not overloaded. Use short copy, clear cards, strong whitespace, and one dominant CTA.

---

## 6. Authentication

### Login

- Google.
- Microsoft.
- Email.

### Sign Up

- Name.
- Email.
- Password.

No unnecessary fields. Onboarding collects the education-specific information after account creation.

---

## 7. Onboarding

Keep the MVP onboarding flow to eight clear steps:

1. School.
2. Year Group.
3. Qualification.
4. Exam Board.
5. Subjects.
6. Accessibility.
7. Goals.
8. Dashboard Ready.

The onboarding flow stays because it creates the student dashboard.

---

## 8. Dashboard — Mission Control

The dashboard is not a report. It is the student’s mission control.

Only display:

- Welcome.
- Daily Motivational Quote.
- Continue Learning.
- Next Exam.
- Today’s Goal.
- Power Grid.
- Weakest Topic.

Remove:

- Duplicate cards.
- Large data tables.
- Repeated statistics.
- Multiple competing actions.
- Extra charts that do not directly guide the student.

The dashboard must answer:

1. What should I do now?
2. How am I doing?
3. What is coming next?

Primary dashboard CTA:

> Continue Learning

---

## 9. Daily Motivational Quote System

### Purpose

Provide every student with one inspiring, age-appropriate quote each day to encourage resilience, confidence, consistency, curiosity, and a positive mindset without distracting from revision.

This is a lightweight MVP engagement feature.

### Dashboard placement

Display the quote beneath the welcome message or inside a compact dashboard header card.

The quote should be visible but not dominate the dashboard.

### Quote card includes

- Quote.
- Speaker.
- Country or region.
- Occupation / contribution.
- Theme.
- Save Quote.
- Learn More.

### Global inspiration framework

The quote library should include inspiring people from across society and all inhabited continents:

- Africa.
- Europe.
- Asia.
- North America.
- South America.
- Oceania.

The library should mix historical and modern individuals, including up-to-date role models as of 2026 and beyond.

Selection should be based on positive contribution to society, not fame alone.

### Categories

Rotate quotes across:

- Education.
- Science and technology.
- Sport.
- Innovation and business.
- Environment.
- Literature.
- Arts and creativity.
- Leadership and service.
- Perseverance.
- Curiosity.
- Kindness.
- Goal setting.
- Growth mindset.

### Quote standards

Every quote must be:

- Correctly attributed.
- Verified using reputable published sources.
- Suitable for ages 11–18.
- Positive and inclusive.
- Free from offensive language.
- Free from hate speech or discrimination.
- Non-political in presentation.
- Non-partisan.
- Appropriate for use in schools.

Quotes must not promote violence, discrimination, gambling, drugs, alcohol, sexual content, or other age-inappropriate themes.

### Quote library metadata

Maintain approximately 365–500 reviewed quotes with:

- Quote ID.
- Quote.
- Speaker.
- Country / region.
- Occupation / contribution.
- Theme.
- Category.
- Suitable age.
- Verified source.
- Copyright / licensing status.
- Active status.
- Review date.

---

## 10. Subjects

Each subject page should contain:

- Continue Learning.
- Progress.
- Topics.
- Mock Exam.

Every subject should use the same layout so students do not have to relearn the interface.

Practice sits inside the subject page.

---

## 11. Topics

Every topic follows the same order:

1. Learn.
2. Worked Example.
3. Practice.
4. Exam Questions.

Students should never have to work out what comes next.

---

## 12. Exam Centre

Exam flow:

1. Subject.
2. Board.
3. Tier.
4. Paper.
5. Time.
6. Start Exam.

The Exam Centre should be simple and focused, with no unnecessary surrounding dashboard content while a paper is active.

---

## 13. Progress

Show:

- Predicted Grade.
- Target Grade.
- Topic Mastery.
- Exam Readiness.
- Study Streak.
- Power Grid.

Use visuals before tables. Tables are only for deeper detail.

---

## 14. Power Grid

The Power Grid is the primary motivational system.

Levels:

1. Ignition.
2. Powered Up.
3. Current Flow.
4. Voltage Rising.
5. Full Circuit.
6. High Voltage.
7. Grid Master.
8. Power Station.
9. Switch Legend.

Power Grid rewards should reinforce:

- Consistency.
- Progress.
- Accuracy.
- Exam readiness.

Do not introduce overlapping reward systems without a clear educational reason.

---

## 15. Visual Design

Style:

- Clean.
- Premium.
- Vibrant.
- Spacious.
- Educational.

The colour system should be vibrant and eye-catching while remaining professional and accessible.

Use the official Switch brand colours from the README / existing design system as the foundation. Do not invent extra brand colours without approval.

Suggested distribution:

- 70% neutral backgrounds: white, off-white, light grey.
- 20% official Switch brand colours: purple and related brand accents.
- 10% semantic colours: success, warning, error, information.

Colour usage:

- Purple: brand, active navigation, primary CTAs, Power Grid highlights.
- Blue: information, progress, helpful guidance.
- Green: success and completed work.
- Amber: warnings, reminders, upcoming deadlines.
- Red: errors and critical issues only.
- Neutrals: backgrounds, cards, body text.

Never rely on colour alone. Pair colour with labels, icons, text, or patterns.

---

## 16. Components

Use approved reusable components only:

- Buttons.
- Cards.
- Inputs.
- Navigation.
- Subject Cards.
- Topic Cards.
- Progress Bars.
- Quote Cards.
- Exam Cards.
- Badges.
- Alerts.
- Modals.

No duplicate component designs.

---

## 17. Typography

- One heading family.
- One body family.
- Clear hierarchy.
- Short paragraphs.
- Generous spacing.
- No decorative fonts.

The typography should feel closer to Apple / Linear: confident, simple, and readable.

---

## 18. Motion

Use subtle animations only:

- Fade.
- Slide.
- Progress fill.
- Hover lift.
- Skeleton loading.
- Smooth transitions.

Animations should communicate state, not distract.

Avoid excessive bounce, spin, flash, or gamified motion that competes with learning.

---

## 19. Accessibility

Target WCAG 2.2 AA as the minimum.

Include:

- Keyboard navigation.
- Screen reader support.
- Read Aloud.
- High contrast mode.
- Adjustable text size.
- Visible focus indicators.
- Responsive layouts.
- Plain language where possible.

All vibrant colours must pass contrast checks.

---

## 20. Definition of Done

A page is complete only if:

- It has one clear purpose.
- It has one primary action.
- It uses approved components.
- It follows the official colour system.
- It passes accessibility checks.
- It works on mobile, tablet, and desktop.
- It contains no duplicate information.
- It loads quickly.
- A new student understands it within three seconds.

---

## 21. Design Governance and Review Checklist

This checklist is mandatory for every new page, feature, component, or redesign before it can be approved for development or merged.

### Navigation

- Navigation remains simple and uncluttered.
- No unnecessary menu items have been added.
- Users can reach any core feature within three clicks.
- Navigation labels are short and easy to understand.

### Layout

- One clear purpose per page.
- One primary action per screen.
- Logical visual hierarchy.
- Consistent spacing using the 8-point spacing system.
- Plenty of whitespace.

### Components

- Existing components have been reused.
- No duplicate component designs have been introduced.
- Cards, buttons, inputs, and navigation follow the design system.
- Icons are consistent across the platform.

### Colour

- Official Switch brand colours from the README / design system have been used.
- Colours communicate meaning rather than decoration.
- Accent colours are applied consistently.
- No additional brand colours have been introduced without approval.

### Accessibility

Every page must:

- Meet WCAG 2.2 AA standards.
- Support keyboard navigation.
- Include visible focus states.
- Provide sufficient colour contrast.
- Never rely on colour alone.
- Work with screen readers.
- Support adjustable text size.
- Function correctly in high-contrast mode.

### Responsiveness

The page must be fully functional on:

- Mobile.
- Tablet.
- Desktop.

Content should adapt without horizontal scrolling or layout breaks.

### Performance

- Fast initial load.
- Optimised images.
- Lazy loading where appropriate.
- Smooth animations.
- Minimal layout shift.
- Efficient rendering.

### Learning experience

Every screen should clearly answer:

1. What am I doing?
2. What should I do next?
3. How am I progressing?

If the page does not answer these questions clearly, simplify it.

### Daily Motivational Quote

Confirm that:

- The quote is correctly attributed.
- The source is reputable.
- It is appropriate for ages 11–18.
- It is inclusive and respectful.
- It aligns with the educational purpose of the platform.

### Final approval checklist

A feature is ready only when all of the following are true:

- One clear page purpose.
- One primary action.
- Uses approved reusable components.
- Uses the official colour system.
- Meets accessibility standards.
- Responsive across devices.
- Fast and performant.
- No duplicate information.
- Consistent with this UI/UX Master Guide.
- Improves the student learning experience.

---

## Golden Rule

If a feature makes the platform more complicated without making revision easier, it should not be included in the MVP.

Every design decision should support one objective:

> Help students learn more effectively with the simplest, clearest, most motivating experience possible.
