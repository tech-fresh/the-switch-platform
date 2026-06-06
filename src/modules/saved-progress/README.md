# Saved Progress Module

Owns save and resume state.

Active access arrangement settings must be stored as snapshots with saved progress records.

Current foundations in this module:

- Saved progress record types for exam sessions and timed assessment attempts
- Autosave helper functions for exam and timed assessment state
- In-memory repository for local prototype flows

This module owns persistence contracts, not UI behaviour.
