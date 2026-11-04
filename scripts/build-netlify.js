const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = process.cwd();

const distDir = path.join(rootDir, 'dist');
const angularBrowserDir = path.join(
  rootDir,
  'dist',
  'wedding-invitation',
  'browser'
);
const landingDir = path.join(rootDir, 'landing');
const appDir = path.join(distDir, 'app');

console.log('🚀 Starting Netlify build...');

// Validate landing directory
if (!fs.existsSync(landingDir)) {
  throw new Error('Landing directory not found.');
}

// Clean previous build
fs.rmSync(distDir, { recursive: true, force: true });

// Build Angular
console.log('📦 Building Angular application...');

execSync('npm run build -- --base-href=/app/', {
  stdio: 'inherit'
});

// Validate Angular output
if (!fs.existsSync(angularBrowserDir)) {
  throw new Error('Angular browser output directory not found.');
}

// Create app directory
fs.mkdirSync(appDir, { recursive: true });

// Copy Angular application
console.log('📂 Copying Angular application...');

fs.cpSync(angularBrowserDir, appDir, {
  recursive: true
});

// Copy landing files to root dist
console.log('📂 Copying landing page...');

for (const item of fs.readdirSync(landingDir)) {
  const source = path.join(landingDir, item);
  const destination = path.join(distDir, item);

  fs.cpSync(source, destination, {
    recursive: true
  });
}

// Remove intermediate Angular build directory
fs.rmSync(
  path.join(distDir, 'wedding-invitation'),
  { recursive: true, force: true }
);

console.log('✅ Netlify build completed successfully!');