# The Switch Platform — UI/UX Master Guide (MVP)

**Version:** Mark 4.0  
**Status:** MVP design standard  
**Purpose:** Single source of truth for the streamlined MVP user experience and visual direction.

## Vision

Build a GCSE revision platform that is professional, vibrant, accessible, fast, simple, and motivating.

Benchmark inspiration:

- Seneca — learning flow and adaptive quizzes.
- Duolingo — motivation and gamification.
- Linear — premium UI and navigation.
- Stripe — layout, spacing, and polish.
- Apple — typography and simplicity.
- Notion — organisation and information hierarchy.
- BBC Bitesize — educational clarity.
- Save My Exams — exam content structure.

The final product should feel unique to The Switch Platform, not like a copy of any existing product.

## Core principles

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

Every screen should answer: **What is the next best thing for me to do right now?**

## MVP architecture

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

## Navigation

Primary navigation:

1. Dashboard
2. Subjects
3. Exams
4. Progress
5. Profile

Practice belongs inside Subjects. Settings, Accessibility, Saved Progress, Read Aloud, Recommendations, and AI Tutor must not become top-level clutter.

## Landing page

Recommended order:

1. Hero.
2. Benefits.
3. GCSE subjects.
4. How it works.
5. Student success.
6. Pricing.
7. FAQ.
8. Footer.

Primary call to action: **Start Learning Free**.

## Authentication

Login:

- Google.
- Microsoft.
- Email.

Sign Up:

- Name.
- Email.
- Password.

No unnecessary fields. Onboarding collects education-specific information.

## Onboarding

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

## Dashboard — Mission Control

Only display:

- Welcome.
- Daily Motivational Quote.
- Continue Learning.
- Next Exam.
- Today’s Goal.
- Power Grid.
- Weakest Topic.

Remove duplicate cards, large tables, repeated statistics, multiple competing actions, and extra charts that do not guide the student.

The dashboard must answer:

1. What should I do now?
2. How am I doing?
3. What is coming next?

Primary dashboard CTA: **Continue Learning**.

## Daily Motivational Quote System

Provide every student with one inspiring, age-appropriate quote each day.

Quote card includes:

- Quote.
- Speaker.
- Country or region.
- Occupation / contribution.
- Theme.
- Save Quote.
- Learn More.

The quote library should include inspiring people from across society and all inhabited continents: Africa, Europe, Asia, North America, South America, and Oceania.

The library should mix historical and modern individuals, including up-to-date role models as of 2026 and beyond. Selection is based on positive contribution to society, not fame alone.

Every quote must be correctly attributed, verified using reputable published sources, suitable for ages 11–18, positive, inclusive, school appropriate, and non-partisan in presentation.

Maintain approximately 365–500 reviewed quotes with source, theme, country/region, licensing status, active status, and review date metadata.

## Subjects

Each subject page should contain:

- Continue Learning.
- Progress.
- Topics.
- Mock Exam.

Every subject should use the same layout. Practice sits inside the subject page.

## Topics

Every topic follows the same order:

1. Learn.
2. Worked Example.
3. Practice.
4. Exam Questions.

## Exam Centre

Exam flow:

1. Subject.
2. Board.
3. Tier.
4. Paper.
5. Time.
6. Start Exam.

The Exam Centre should stay simple and focused, especially during active papers.

## Progress

Show:

- Predicted Grade.
- Target Grade.
- Topic Mastery.
- Exam Readiness.
- Study Streak.
- Power Grid.

Use visuals before tables.

## Power Grid

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

Rewards should reinforce consistency, progress, accuracy, and exam readiness.

## Visual design

Style: clean, premium, vibrant, spacious, educational.

The colour system should be vibrant and eye-catching while remaining professional and accessible. Use the official Switch brand colours from the README / existing design system as the foundation.

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

## Components

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

## Typography

Use one heading family and one body family. Keep hierarchy clear, paragraphs short, spacing generous, and avoid decorative fonts.

## Motion

Use subtle animations only: fade, slide, progress fill, hover lift, skeleton loading, and smooth transitions. Motion should communicate state, not distract.

## Accessibility

Target WCAG 2.2 AA as the minimum.

Include keyboard navigation, screen reader support, Read Aloud, high contrast mode, adjustable text size, visible focus indicators, responsive layouts, and plain language where possible.

All vibrant colours must pass contrast checks.

## Definition of Done

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

## Design Governance and Review Checklist

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

Every page must meet WCAG 2.2 AA, support keyboard navigation, include visible focus states, provide sufficient colour contrast, never rely on colour alone, work with screen readers, support adjustable text size, and function in high-contrast mode.

### Responsiveness

The page must be fully functional on mobile, tablet, and desktop without horizontal scrolling or layout breaks.

### Performance

Fast initial load, optimised images, lazy loading where appropriate, smooth animations, minimal layout shift, and efficient rendering.

### Learning experience

Every screen should clearly answer:

1. What am I doing?
2. What should I do next?
3. How am I progressing?

If the page does not answer these questions clearly, simplify it.

### Daily Motivational Quote

Confirm that the quote is correctly attributed, from a reputable source, appropriate for ages 11–18, inclusive, respectful, and aligned with the educational purpose of the platform.

## Golden Rule

If a feature makes the platform more complicated without making revision easier, it should not be included in the MVP.

Every design decision should support one objective: help students learn more effectively with the simplest, clearest, most motivating experience possible.
