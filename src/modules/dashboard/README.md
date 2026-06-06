# Dashboard Module

Owns the student-home aggregation layer.

This module does not calculate exam logic, timed assessment rules, or progress scoring itself.

It asks other modules for their data and prepares one combined view model for home-style routes such as:

- `/`
- `/dashboard`

Current foundations in this module:

- Home screen metrics
- Route launch cards
- Live exam and timed assessment session summaries
- Subject focus cards built from Power Grid data

This keeps page components simple and prevents dashboard composition logic from being trapped inside the frontend route files.
