/**
 * Generous fetch defaults for supportive live regression scripts (not strict A-4).
 * Imported before launch-utils so cold-start retries read the right env at runtime.
 */
process.env.SWITCH_LIVE_FETCH_TIMEOUT_MS ??= "90000";
process.env.SWITCH_LIVE_FETCH_ATTEMPTS ??= "6";
process.env.SWITCH_SUPPORTIVE_ROUTE_WARMUP_ATTEMPTS ??= "8";
process.env.SWITCH_SUPPORTIVE_ROUTE_WARMUP_DELAY_MS ??= "3000";
process.env.SWITCH_LIVE_HTTP_WARMUP_ATTEMPTS ??= "12";
process.env.SWITCH_LIVE_HTTP_WARMUP_DELAY_MS ??= "5000";
process.env.SWITCH_LIVE_HTTP_WARMUP_TIMEOUT_MS ??= "20000";
