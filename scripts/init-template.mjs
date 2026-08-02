#!/usr/bin/env node

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const OLD_SERVICE_NAME = 'azure-devops-service-starter';
const OLD_DISPLAY_NAME = 'Azure Container Apps Service Starter';
const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  'coverage',
  'dist',
  'node_modules',
]);
const EXCLUDED_FILES = new Set([
  '.DS_Store',
  '.pwdnote.enc',
  path.normalize('scripts/init-template.mjs'),
]);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const positional = args.filter((argument) => argument !== '--dry-run');

if (positional.length !== 1) {
  console.error('Usage: node scripts/init-template.mjs [--dry-run] <service-name>');
  process.exitCode = 1;
} else {
  const serviceName = positional[0];
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slugPattern.test(serviceName) || serviceName.length > 32) {
    console.error(
      'Service name must be a lowercase hyphen-separated slug of at most 32 characters.',
    );
    process.exitCode = 1;
  } else {
    await initialize(serviceName, dryRun);
  }
}

async function initialize(serviceName, isDryRun) {
  const displayName = serviceName
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
  const root = process.cwd();
  const files = await findTextFiles(root);
  const changedFiles = [];

  for (const file of files) {
    const contents = await readFile(file, 'utf8');
    const updated = contents
      .replaceAll(OLD_SERVICE_NAME, serviceName)
      .replaceAll(OLD_DISPLAY_NAME, displayName);

    if (updated !== contents) {
      changedFiles.push(path.relative(root, file));
      if (!isDryRun) {
        await writeFile(file, updated, 'utf8');
      }
    }
  }

  console.log(`${isDryRun ? 'Would initialize' : 'Initialized'}: ${serviceName}`);
  console.log(`Display name: ${displayName}`);
  console.log(`${isDryRun ? 'Files that would change' : 'Files changed'}: ${changedFiles.length}`);
  for (const file of changedFiles) {
    console.log(`- ${file}`);
  }

  const remaining = [];
  for (const file of files) {
    const contents = await readFile(file, 'utf8');
    if (contents.includes(OLD_SERVICE_NAME) || contents.includes(OLD_DISPLAY_NAME)) {
      remaining.push(path.relative(root, file));
    }
  }

  console.log(`Remaining old identifiers: ${remaining.length}`);
  for (const file of remaining) {
    console.log(`- ${file}`);
  }
}

async function findTextFiles(root) {
  const files = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute);

      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile() && !EXCLUDED_FILES.has(relative)) {
        const buffer = await readFile(absolute);
        if (!buffer.includes(0)) {
          files.push(absolute);
        }
      }
    }
  }

  await visit(root);
  return files.sort();
}
