# Exam Engine Module

Owns exam mode rules and official exam timing.

Access arrangements are applied through the Access Arrangements module without moving exam timing ownership out of this module.

Current foundations in this module:

- Mock GCSE paper definitions
- Exam session creation helpers
- Question-slot blueprints with rotating variants
- Fresh-attempt generation that keeps topic repetition while varying exact questions
- Access arrangement aware official duration handling
- Resume hydration through the Saved Progress module
- Session-owned question-set snapshots for stable resume and results review
- Post-submit answer review against the exact submitted question set
- Safer live recovery paths for reload, autosave, submit, and fresh-attempt failures
- Framework-neutral contracts for paper lists and session delivery

This module should not own long-term persistence. It asks Saved Progress to store and restore session state.
