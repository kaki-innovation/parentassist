const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Let Metro watch the monorepo packages/ directory so workspace
// imports (@parentassist/config, @parentassist/types, etc.) resolve.
config.watchFolders = [monorepoRoot];

// Tell Metro where to look for node_modules — project first, then root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
