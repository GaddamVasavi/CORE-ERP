#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set([
  'node_modules',
  'target',
  'dist',
  'build',
  '.git',
  '.idea',
  '.vscode',
  'coverage',
  '.system_generated'
]);

const IGNORE_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'mvnw',
  'mvnw.cmd'
]);

const EXTENSIONS = {
  // Backend
  '.java': 'Backend (Java)',
  '.sql': 'Database (Flyway / SQL)',
  
  // Frontend
  '.ts': 'Frontend (TypeScript)',
  '.tsx': 'Frontend (React TSX)',
  '.css': 'Frontend (CSS/Tailwind)',
  '.html': 'Frontend (HTML)',
  
  // Config & Infra
  '.yml': 'Infra & Config (YAML)',
  '.yaml': 'Infra & Config (YAML)',
  '.xml': 'Build & Config (Maven XML)',
  '.json': 'Configuration (JSON)',
  '.conf': 'Infra (Nginx/Conf)',
  '.properties': 'Backend Config (Properties)',
  'Dockerfile': 'Docker',
  
  // Docs & Scripts
  '.md': 'Documentation (Markdown)',
  '.js': 'Scripts & Tooling (JS)',
  '.sh': 'Scripts & Tooling (Shell)',
  '.ps1': 'Scripts & Tooling (PowerShell)'
};

function countFileLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let meaningfulLines = 0;
    let commentLines = 0;
    let blankLines = 0;

    let inBlockComment = false;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        blankLines++;
        continue;
      }
      if (trimmed.startsWith('/*') || trimmed.startsWith('<!--')) {
        inBlockComment = true;
      }
      if (inBlockComment) {
        commentLines++;
        if (trimmed.endsWith('*/') || trimmed.endsWith('-->')) {
          inBlockComment = false;
        }
        continue;
      }
      if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('--')) {
        commentLines++;
        continue;
      }
      meaningfulLines++;
    }

    return {
      total: lines.length,
      meaningful: meaningfulLines,
      comment: commentLines,
      blank: blankLines
    };
  } catch (err) {
    return { total: 0, meaningful: 0, comment: 0, blank: 0 };
  }
}

function categorizePath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/test/') || normalized.includes('__tests__') || normalized.includes('.test.') || normalized.includes('.spec.')) {
    return 'Tests';
  }
  if (normalized.startsWith('backend/')) {
    return 'Backend';
  }
  if (normalized.startsWith('frontend/')) {
    return 'Frontend';
  }
  if (normalized.startsWith('docs/')) {
    return 'Documentation';
  }
  if (normalized.startsWith('docker/') || normalized.includes('.github/') || normalized.startsWith('scripts/')) {
    return 'Infra & Tooling';
  }
  return 'Root / Config';
}

function walkDir(dir, stats, fileList) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walkDir(fullPath, stats, fileList);
      }
    } else if (entry.isFile()) {
      if (IGNORE_FILES.has(entry.name)) continue;

      const ext = path.extname(entry.name);
      const isDockerfile = entry.name === 'Dockerfile' || entry.name.startsWith('Dockerfile.');
      const fileType = isDockerfile ? 'Dockerfile' : ext;

      if (EXTENSIONS[fileType]) {
        const counts = countFileLines(fullPath);
        const category = categorizePath(relPath);

        if (!stats.byCategory[category]) {
          stats.byCategory[category] = { files: 0, total: 0, meaningful: 0, comment: 0, blank: 0 };
        }
        stats.byCategory[category].files += 1;
        stats.byCategory[category].total += counts.total;
        stats.byCategory[category].meaningful += counts.meaningful;
        stats.byCategory[category].comment += counts.comment;
        stats.byCategory[category].blank += counts.blank;

        if (!stats.byExt[fileType]) {
          stats.byExt[fileType] = { files: 0, total: 0, meaningful: 0, comment: 0, blank: 0, label: EXTENSIONS[fileType] };
        }
        stats.byExt[fileType].files += 1;
        stats.byExt[fileType].total += counts.total;
        stats.byExt[fileType].meaningful += counts.meaningful;
        stats.byExt[fileType].comment += counts.comment;
        stats.byExt[fileType].blank += counts.blank;

        stats.totalFiles += 1;
        stats.totalLines += counts.total;
        stats.totalMeaningful += counts.meaningful;
        stats.totalComments += counts.comment;
        stats.totalBlank += counts.blank;

        fileList.push({ path: relPath, category, counts });
      }
    }
  }
}

function main() {
  const root = process.cwd();
  const stats = {
    totalFiles: 0,
    totalLines: 0,
    totalMeaningful: 0,
    totalComments: 0,
    totalBlank: 0,
    byCategory: {},
    byExt: {}
  };
  const fileList = [];

  walkDir(root, stats, fileList);

  console.log('================================================================================');
  console.log('                      CoreERP Codebase LOC Analysis                             ');
  console.log('================================================================================\n');

  console.log('Category Breakdown:');
  console.log('--------------------------------------------------------------------------------');
  console.log(
    'Category'.padEnd(20) +
    'Files'.padStart(10) +
    'Meaningful LOC'.padStart(18) +
    'Total LOC'.padStart(14) +
    'Comments'.padStart(10) +
    'Blank'.padStart(8)
  );
  console.log('--------------------------------------------------------------------------------');
  for (const [cat, data] of Object.entries(stats.byCategory)) {
    console.log(
      cat.padEnd(20) +
      String(data.files).padStart(10) +
      String(data.meaningful).padStart(18) +
      String(data.total).padStart(14) +
      String(data.comment).padStart(10) +
      String(data.blank).padStart(8)
    );
  }
  console.log('--------------------------------------------------------------------------------');
  console.log(
    'TOTAL'.padEnd(20) +
    String(stats.totalFiles).padStart(10) +
    String(stats.totalMeaningful).padStart(18) +
    String(stats.totalLines).padStart(14) +
    String(stats.totalComments).padStart(10) +
    String(stats.totalBlank).padStart(8)
  );
  console.log('================================================================================\n');

  console.log(`Target: 60,000 - 70,000 meaningful LOC | Current: ${stats.totalMeaningful.toLocaleString()} meaningful LOC`);
  console.log(`Progress to Target: ${((stats.totalMeaningful / 65000) * 100).toFixed(1)}%\n`);
}

main();
