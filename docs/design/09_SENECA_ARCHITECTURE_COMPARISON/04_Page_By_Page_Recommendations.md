# 04 — Page-by-Page Recommendations

## Design standard

Each page should have:

1. one clear purpose
2. one primary action
3. a visible progress signal where relevant
4. a next route
5. no dead-end content

## Homepage

**Purpose:** explain the product quickly and move the learner to sign in.

Recommended layout:

```text
Hero
Trust/proof strip
How it works
Subjects covered
Power Grid preview
Accessibility/support promise
Final CTA
```

Primary action: `Start learning free` or `Sign in`.

Avoid: too many feature cards before the user understands the journey.

## Login

**Purpose:** get the learner into the correct flow.

Recommended behaviour:

```text
If no session → show providers
If session + onboarding incomplete → onboarding
If session + onboarding complete → dashboard
```

Primary action: chosen auth provider.

Avoid: treating admin/editor access as equal to student access visually.

## Onboarding

**Purpose:** create the student's dashboard.

Keep all 8 steps. Do not shorten them unless the operator explicitly reopens onboarding scope.

Recommended emphasis:

- Qualification
- Year/goal
- School
- Exam board
- Subjects
- Accessibility/support
- Guardian/consent
- Dashboard ready

Primary action: `Continue setup` / `Create dashboard`.

Avoid: making onboarding feel like a form. It should feel like building a personalised study space.

## Dashboard

**Purpose:** show exactly what to do next.

Recommended sections:

```text
Continue learning
Today's Power Grid progress
Weakest topic
Next exam task
Weekly planner
Recent saved work
```

Primary action: resume or start the highest-value task.

Avoid: equal-weight cards everywhere.

## Subjects

**Purpose:** start learning by subject and topic.

Recommended structure:

```text
Subject header
Progress summary
Continue topic
Topic grid
Mock exam / timed practice link
```

Primary action: `Continue topic`.

Avoid: showing every possible route before the student has selected a topic.

## Topic / Lesson

**Purpose:** learn one concept and practise it immediately.

Recommended flow:

```text
Short explanation
Worked example
One question
Feedback
Next question or review
```

Primary action: `Answer` then `Next`.

Avoid: long textbook-style content.

## Practice / Timed assessments

**Purpose:** let students practise under controlled time.

Recommended structure:

```text
Choose subject/topic
Choose duration
Start checkpoint
Autosave progress
Submit
Results
```

Primary action: `Start timed practice`.

Avoid: too many filters before a default recommendation.

## Exams

**Purpose:** full paper practice.

Recommended structure:

```text
Matched papers from onboarding
Board + tier + duration
Resume active paper first
Start new paper second
```

Primary action: `Resume paper` or `Start paper`.

Avoid: offering boards or papers that do not exist in live inventory.

## Results

**Purpose:** turn performance into the next action.

Recommended structure:

```text
Score
Strong areas
Mistakes
Weak topics
Power Grid update
Next action
```

Primary action: `Review mistakes` or `Practise weak topic`.

Avoid: score-only pages.

## Power Grid

**Purpose:** motivate and show improvement.

Recommended structure:

```text
Current level
XP/progress bar
What improved
What is blocking next level
Recommended action
```

Primary action: `Improve weakest topic`.

Avoid: XP with no clear learning purpose.

## Recommendations

**Purpose:** be the brain of the website.

Recommended ranking order:

1. active saved work
2. urgent weak topic
3. exam-board-matched paper
4. timed checkpoint
5. accessibility/support setup if missing

Primary action: the single best route.

Avoid: generic recommendations that do not use saved evidence.

## Accessibility

**Purpose:** make support settings practical inside real study routes.

Recommended structure:

```text
Current support profile
Text/read-aloud controls
Exam timing support
Saved preference summary
Try in a practice flow
```

Primary action: `Save support settings`.

Avoid: settings that do not visibly affect exam or practice flows.
