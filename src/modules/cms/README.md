# CMS Module

Owns content-source boundaries and update architecture for the student-facing content stack.

Current foundations in this module:

- CMS provider definitions
- content reference manifests for subjects, topics, revision, and quiz content
- sync-status overview for current and future content sources
- framework-neutral contract for CMS overview delivery
- editorial gate summary showing reviewed, student-visible, and blocked content states
- source reference visibility before a full CMS or school administration tool exists
- local editorial workflow records with API-backed queue updates for controlled review steps
- backend adapter and runtime mode boundary so the current live writable workflow can later be connected to a different production CMS source without breaking review controls
