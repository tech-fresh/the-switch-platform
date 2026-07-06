# Recommendations Module

**Consolidated documentation:** [`PLATFORM-GUIDE.md`](../../../PLATFORM-GUIDE.md) → Module reference → Recommendations Module

**Architecture principle:** Recommendations is the platform **decision engine (brain)** — should drive next-step navigation across routes. Future ranking includes Recall Strength, weak topics, streaks, onboarding context. See [`docs/design/09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md`](../../../docs/design/09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md).

Service entry: `src/modules/recommendations/service.ts`
