import "./load-script-env.mjs";

const { getPersistenceRuntimeConfig } = await import("../src/lib/persistence/runtime.ts");
const { getPersistenceRecoveryStatus } = await import("../src/lib/persistence/recovery.ts");

const runtime = getPersistenceRuntimeConfig();
const status = await getPersistenceRecoveryStatus(runtime);

console.log("Persistence recovery check:");
console.log(`- Driver: ${runtime.driver}`);
console.log(`- Data directory: ${runtime.dataDirectory}`);
console.log(`- Backup directory: ${runtime.backupDirectory ?? "none"}`);
console.log(`- Recovery ready: ${status.isReady ? "yes" : "no"}`);
console.log(`- Recovery issues: ${status.issueCount}`);

for (const file of status.files) {
  console.log(
    `- ${file.label}: active=${file.activeExists ? "yes" : "no"}, backup=${file.backupExists ? "yes" : "no"}, match=${file.matchesBackup ? "yes" : "no"}, issue=${file.issue ?? "none"}`,
  );
}

if (!status.isReady) {
  process.exitCode = 1;
}
