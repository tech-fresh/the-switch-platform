# Exam Engine Module

Owns exam mode rules and official exam timing.

Access arrangements are applied through the Access Arrangements module without moving exam timing ownership out of this module.

Current foundations in this module:

- Mock GCSE paper definitions
- Exam session creation helpers
- Access arrangement aware official duration handling
- Resume hydration through the Saved Progress module

This module should not own long-term persistence. It asks Saved Progress to store and restore session state.
