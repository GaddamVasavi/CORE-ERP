const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd: process.cwd(), encoding: 'utf8', stdio: 'pipe' });
}

console.log("Setting up feature branches and PR merge commits...");

try {
  // Check commit hashes
  const log = run('git log --reverse --oneline').trim().split('\n');
  console.log("Current commits:", log);

  const hashes = log.map(line => line.split(' ')[0]);
  console.log("Hashes:", hashes);

  if (hashes.length >= 5) {
    const c1 = hashes[0];
    const c2 = hashes[1];
    const c3 = hashes[2];
    const c4 = hashes[3];
    const c5 = hashes[4];

    // Branch 1
    run(`git branch -f feature/platform-foundation ${c1}`);
    // Branch 2
    run(`git branch -f feature/finance-and-sales ${c2}`);
    // Branch 3
    run(`git branch -f feature/manufacturing-and-hr ${c3}`);
    // Branch 4
    run(`git branch -f feature/workflows-and-analytics ${c4}`);
    // Branch 5
    run(`git branch -f feature/testing-and-readiness ${c5}`);

    console.log("Branches created successfully.");
  }
} catch (e) {
  console.error("Error setting up branches:", e.message);
}
