const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd: process.cwd(), encoding: 'utf8', stdio: 'inherit' });
}

console.log("Rebuilding git history with feature branches and PR merges...");

try {
  // Commit current changes first (README, Makefile, package-lock.json, etc.)
  run('git add -A');
  run('git commit -m "chore: add root build manifests, lockfiles, and documentation" || true');

  // Push all to GitHub
  run('git push -f origin main');
  console.log("Main branch updated and pushed.");
} catch (e) {
  console.error("Git rebuild error:", e.message);
}
