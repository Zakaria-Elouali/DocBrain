const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const execAsync = promisify(exec);

async function main() {
  console.log('Starting Sass optimization...');
  
  // Step 1: Clean Vite cache
  console.log('Cleaning Vite cache...');
  try {
    await execAsync('npm run clean:cache');
    console.log('Vite cache cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning Vite cache:', error);
  }
  
  // Step 2: Compile Sass with optimized settings
  console.log('Compiling Sass with optimized settings...');
  try {
    await execAsync('sass --load-path=node_modules src/assets/scss/main.scss:src/assets/css/main.css --style=compressed --no-source-map');
    console.log('Sass compiled successfully.');
  } catch (error) {
    console.error('Error compiling Sass:', error);
  }
  
  // Step 3: Create a .sassrc.json file with optimized settings
  console.log('Creating optimized .sassrc.json...');
  const sassrcContent = {
    "includePaths": ["node_modules"],
    "outputStyle": "compressed",
    "sourceMap": false,
    "quietDeps": true
  };
  
  try {
    await writeFileAsync('.sassrc.json', JSON.stringify(sassrcContent, null, 2), 'utf8');
    console.log('.sassrc.json created successfully.');
  } catch (error) {
    console.error('Error creating .sassrc.json:', error);
  }
  
  // Step 4: Update package.json scripts for better performance
  console.log('Updating package.json scripts...');
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(await readFileAsync(packageJsonPath, 'utf8'));
    
    // Add or update scripts for better performance
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev:fast": "VITE_FAST_REFRESH=true vite --force",
      "build:fast": "vite build --minify terser",
      "build:analyze": "vite build --mode analyze"
    };
    
    await writeFileAsync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('package.json updated successfully.');
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
  
  console.log('Sass optimization completed successfully!');
  console.log('');
  console.log('To run the app with optimized settings, use:');
  console.log('npm run dev:fast');
  console.log('');
  console.log('For production builds with optimized settings, use:');
  console.log('npm run build:fast');
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
