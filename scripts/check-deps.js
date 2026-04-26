#!/usr/bin/env node

/**
 * Pre-build dependency check script
 * Run this before building to ensure all dependencies are available
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = Object.keys(packageJson.dependencies);
const requiredDevDeps = Object.keys(packageJson.devDependencies);

console.log('🔍 Checking dependencies...\n');

let missing = [];

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules directory not found. Run: npm install');
  process.exit(1);
}

// Check dependencies
requiredDeps.forEach(dep => {
  const depPath = path.join(nodeModulesPath, dep);
  if (!fs.existsSync(depPath)) {
    missing.push(dep);
  }
});

// Check dev dependencies
requiredDevDeps.forEach(dep => {
  const depPath = path.join(nodeModulesPath, dep);
  if (!fs.existsSync(depPath)) {
    missing.push(dep);
  }
});

if (missing.length > 0) {
  console.error('❌ Missing dependencies:');
  missing.forEach(dep => console.error(`   - ${dep}`));
  console.error('\nRun: npm install');
  process.exit(1);
}

console.log('✅ All dependencies are installed');
console.log(`✅ ${requiredDeps.length} production dependencies`);
console.log(`✅ ${requiredDevDeps.length} development dependencies\n`);

// Check environment variables
console.log('🔍 Checking environment variables...\n');

const envExamplePath = path.join(__dirname, '..', '.env.example');
const envLocalPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envLocalPath)) {
  console.warn('⚠️  .env.local file not found');
  console.warn('   Copy .env.example to .env.local and add your API keys\n');
} else {
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  const envLocal = fs.readFileSync(envLocalPath, 'utf8');
  
  const requiredVars = envExample
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=')[0]);

  let missingVars = [];
  requiredVars.forEach(varName => {
    if (!envLocal.includes(`${varName}=`) && !envLocal.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables in .env.local:');
    missingVars.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('\n');
  } else {
    console.log('✅ All required environment variables are set\n');
  }
}

console.log('✅ Pre-build checks passed!');
