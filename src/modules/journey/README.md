# Journey (next-action orchestrator)

Thin orchestrator that returns **one primary CTA** plus secondary options for signed-in routes.

See [`docs/design/09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md`](../../../docs/design/09_SENECA_ARCHITECTURE_COMPARISON/ARCHITECTURE-PRINCIPLES.md).

| File | Role |
|------|------|
| `types.ts` | `PrimaryNextAction`, `JourneyContext` |
| `vocabulary.ts` | Standard next-action labels |
| `ranking.ts` | Precedence merge rules |
| `service.ts` | `getJourneyContext`, `getPrimaryNextAction` |

API: `GET /api/journey/next-action`
