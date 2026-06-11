# Saved Progress Module

Owns save and resume state.

Active access arrangement settings must be stored as snapshots with saved progress records.

Current foundations in this module:

- Saved progress record types for exam sessions and timed assessment attempts
- Autosave helper functions for exam and timed assessment state
- Local file-backed repository for local prototype flows
- Saved Progress overview service for shared resume surfaces across modules
- Shared recovery and review routing decisions for cross-route resume behaviour
- Shared session-insights derivation for score, completion, review, timing, and support signals
- Save-time normalization protecting against stale status changes and invalid resume pointers
- Safe fallback summaries when linked session metadata is unavailable
- Shared write-side status transitions for pause and resume behaviour through the API layer
- Framework-neutral overview contract for thin API delivery

This module owns persistence contracts, not UI behaviour.
