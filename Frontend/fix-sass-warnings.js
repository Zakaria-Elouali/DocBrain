const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Function to replace deprecated color functions with modern alternatives
function replaceDeprecatedFunctions(content) {
  // Replace darken() with color.adjust()
  content = content.replace(/darken\(\$([^,]+),\s*(\d+(?:\.\d+)?)%\)/g, 'color.adjust($$$1, $lightness: -$2%)');
  
  // Replace lighten() with color.adjust()
  content = content.replace(/lighten\(\$([^,]+),\s*(\d+(?:\.\d+)?)%\)/g, 'color.adjust($$$1, $lightness: $2%)');
  
  // Replace rgba() with color.adjust() for transparency
  // This is a more complex replacement, so we'll leave it for manual fixes
  
  return content;
}

// Function to process a single file
async function processFile(filePath) {
  try {
    const content = await readFileAsync(filePath, 'utf8');
    
    // Check if the file contains deprecated functions
    if (content.includes('darken(') || content.includes('lighten(')) {
      console.log(`Processing: ${filePath}`);
      
      // Add the color module import if it's not already there
      let newContent = content;
      if (!content.includes('@use "sass:color"')) {
        newContent = '@use "sass:color";\n\n' + content;
      }
      
      // Replace deprecated functions
      newContent = replaceDeprecatedFunctions(newContent);
      
      // Write the updated content back to the file
      await writeFileAsync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to recursively process all SCSS files in a directory
async function processDirectory(directoryPath) {
  try {
    const files = await readdirAsync(directoryPath);
    
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await statAsync(filePath);
      
      if (stats.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(filePath);
      } else if (stats.isFile() && filePath.endsWith('.scss')) {
        // Process SCSS files
        await processFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
  }
}

// Main function
async function main() {
  const scssDirectory = path.join(__dirname, 'src', 'assets', 'scss');
  console.log(`Starting to process SCSS files in: ${scssDirectory}`);
  
  await processDirectory(scssDirectory);
  
  console.log('Finished processing all SCSS files');
}

// Run the main function
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
