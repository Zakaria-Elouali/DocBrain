const fs = require('fs');
const path = require('path');
const sass = require('sass');
const { promisify } = require('util');
const { exec } = require('child_process');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const execAsync = promisify(exec);

async function ensureDirectoryExists(directory) {
  try {
    await mkdirAsync(directory, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function main() {
  console.log('Precompiling Sass files...');
  
  // Define paths
  const mainScssPath = path.join(__dirname, 'src', 'assets', 'scss', 'main.scss');
  const outputCssPath = path.join(__dirname, 'src', 'assets', 'css', 'main.css');
  
  // Ensure the output directory exists
  await ensureDirectoryExists(path.dirname(outputCssPath));
  
  try {
    // Compile Sass
    console.log('Compiling main.scss...');
    const result = sass.compile(mainScssPath, {
      style: 'compressed',
      loadPaths: ['node_modules'],
      sourceMap: false,
      quietDeps: true
    });
    
    // Write the compiled CSS to file
    await writeFileAsync(outputCssPath, result.css);
    console.log(`Compiled CSS written to ${outputCssPath}`);
    
    // Process with PostCSS
    console.log('Processing with PostCSS...');
    await execAsync(`npx postcss ${outputCssPath} --use autoprefixer cssnano --no-map -o ${outputCssPath}`);
    console.log('PostCSS processing completed');
    
    console.log('Sass precompilation completed successfully!');
  } catch (error) {
    console.error('Error during Sass precompilation:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
