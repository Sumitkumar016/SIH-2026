import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const outputFile = path.join(projectRoot, 'CONSOLIDATED_CODEBASE.txt');

// Directories/files to ignore
const ignoredDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.gemini',
  '.system_generated',
  'migrations'
]);

const ignoredFiles = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'CONSOLIDATED_CODEBASE.txt',
  'FULL_CODEBASE.txt',
  '.DS_Store'
]);

const allowedExtensions = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.html',
  '.prisma',
  '.env.example',
  '.sql'
]);

// Binary / media extensions to strictly skip
const binaryExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
  '.pdf', '.zip', '.tar', '.gz', '.mp4', '.mp3',
  '.woff', '.woff2', '.ttf', '.eot', '.log'
]);

function shouldIncludeFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  
  // Must be frontend, backend, or prisma/schema.prisma
  const isFrontend = normalized.startsWith('frontend/');
  const isBackend = normalized.startsWith('backend/');
  const isPrisma = normalized.startsWith('prisma/');
  
  if (!isFrontend && !isBackend && !isPrisma) {
    return false;
  }
  
  // Skip migrations
  if (normalized.includes('/migrations/') || normalized.startsWith('backend/prisma/migrations/')) {
    return false;
  }
  
  const base = path.basename(relPath);
  if (ignoredFiles.has(base)) return false;
  
  const ext = path.extname(relPath).toLowerCase();
  if (binaryExtensions.has(ext)) return false;
  
  // Exclude large mock data files if not needed or include?
  // Let's check what extensions
  if (allowedExtensions.has(ext) || base.startsWith('.env')) {
    return true;
  }
  
  return false;
}

function collectFiles(dir, collected = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      collectFiles(path.join(dir, entry.name), collected);
    } else if (entry.isFile()) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(projectRoot, fullPath);
      if (shouldIncludeFile(relPath)) {
        collected.push({
          fullPath,
          relPath: relPath.replace(/\\/g, '/')
        });
      }
    }
  }
  return collected;
}

console.log('Collecting files...');
const files = collectFiles(projectRoot);

// Sort files: Prisma schema first, then backend, then frontend
files.sort((a, b) => {
  const getScore = (p) => {
    if (p.includes('schema.prisma')) return 0;
    if (p.startsWith('backend/')) return 1;
    if (p.startsWith('frontend/')) return 2;
    return 3;
  };
  const scoreDiff = getScore(a.relPath) - getScore(b.relPath);
  if (scoreDiff !== 0) return scoreDiff;
  return a.relPath.localeCompare(b.relPath);
});

console.log(`Found ${files.length} files to consolidate.`);

let totalChars = 0;
let totalLines = 0;

const mdOutputFile = path.join(projectRoot, 'CONSOLIDATED_CODEBASE.md');

const outStreamTxt = fs.createWriteStream(outputFile, { encoding: 'utf8' });
const outStreamMd = fs.createWriteStream(mdOutputFile, { encoding: 'utf8' });

// Header TXT
outStreamTxt.write(`/*******************************************************************************\n`);
outStreamTxt.write(` * MPLADS SENTINEL - CONSOLIDATED CODEBASE\n`);
outStreamTxt.write(` * Generated on: ${new Date().toISOString()}\n`);
outStreamTxt.write(` * Total Files: ${files.length}\n`);
outStreamTxt.write(` * Scope: Frontend, Backend, Prisma Schema (Excluding Migrations & Dependencies)\n`);
outStreamTxt.write(` *******************************************************************************/\n\n`);

outStreamTxt.write(`// =============================================================================\n`);
outStreamTxt.write(`// TABLE OF CONTENTS (${files.length} Files)\n`);
outStreamTxt.write(`// =============================================================================\n`);
files.forEach((f, idx) => {
  outStreamTxt.write(`// ${String(idx + 1).padStart(3, ' ')}. ${f.relPath}\n`);
});
outStreamTxt.write(`\n\n`);

// Header MD
outStreamMd.write(`# MPLADS SENTINEL - CONSOLIDATED CODEBASE\n\n`);
outStreamMd.write(`- **Generated on**: ${new Date().toISOString()}\n`);
outStreamMd.write(`- **Total Files**: ${files.length}\n`);
outStreamMd.write(`- **Scope**: Frontend, Backend, Prisma Schema (Excluding Migrations & Dependencies)\n\n`);

outStreamMd.write(`## Table of Contents\n\n`);
files.forEach((f, idx) => {
  const anchor = f.relPath.toLowerCase().replace(/[^a-z0-9]/g, '-');
  outStreamMd.write(`${idx + 1}. [${f.relPath}](#${anchor})\n`);
});
outStreamMd.write(`\n---\n\n`);

function getLang(ext) {
  switch (ext) {
    case '.js': return 'javascript';
    case '.jsx': return 'jsx';
    case '.ts': return 'typescript';
    case '.tsx': return 'tsx';
    case '.json': return 'json';
    case '.css': return 'css';
    case '.html': return 'html';
    case '.prisma': return 'prisma';
    case '.sql': return 'sql';
    default: return '';
  }
}

// Write each file
for (let i = 0; i < files.length; i++) {
  const { fullPath, relPath } = files[i];
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n').length;
  totalLines += lines;
  totalChars += content.length;
  const ext = path.extname(relPath).toLowerCase();
  const lang = getLang(ext);

  // TXT Format
  outStreamTxt.write(`\n`);
  outStreamTxt.write(`/*******************************************************************************\n`);
  outStreamTxt.write(` * FILE [${i + 1}/${files.length}]: ${relPath}\n`);
  outStreamTxt.write(` * Lines: ${lines} | Size: ${(content.length / 1024).toFixed(1)} KB\n`);
  outStreamTxt.write(` *******************************************************************************/\n\n`);
  outStreamTxt.write(content);
  outStreamTxt.write(`\n\n`);

  // MD Format
  outStreamMd.write(`\n### \`${relPath}\`\n\n`);
  outStreamMd.write(`*File [${i + 1}/${files.length}] | Lines: ${lines} | Size: ${(content.length / 1024).toFixed(1)} KB*\n\n`);
  outStreamMd.write('```' + lang + '\n');
  outStreamMd.write(content);
  outStreamMd.write(content.endsWith('\n') ? '```\n\n' : '\n```\n\n');
}

outStreamTxt.end();
outStreamMd.end(() => {
  console.log('Finished writing CONSOLIDATED_CODEBASE.txt and CONSOLIDATED_CODEBASE.md');
  console.log(`Total files: ${files.length}`);
  console.log(`Total lines: ${totalLines}`);
  console.log(`Total characters: ${totalChars} (~${(totalChars / (1024 * 1024)).toFixed(2)} MB)`);
});

