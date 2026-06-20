import { execFileSync } from "node:child_process";

function runGit(args) {
  execFileSync("git", args, { stdio: "inherit" });
}

runGit(["config", "--local", "core.hooksPath", ".githooks"]);
console.log("Enabled repo-managed git hooks at .githooks.");
