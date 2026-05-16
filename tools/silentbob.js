#!/usr/bin/env node

/**
 * SilentBob - Interactive CLI Tool
 * 
 * Interactive command-line interface for processing modified files
 * with IBM Bob IDE integration and automated test validation
 * 
 * @module silentbob
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const detectChanges = require('./detect-changes');
const { runTests } = require('./auto-healer');

/**
 * Gets the test file path for a given source file
 * 
 * @param {string} filePath - Source file path (e.g., 'tests/modify/js/calculator.js')
 * @returns {string} Test file path (e.g., 'tests/modify/js/calculator.test.js')
 */
function getTestFilePath(filePath) {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath, '.js');
  return path.join(dir, `${fileName}.test.js`);
}

/**
 * Reads file content synchronously
 * 
 * @param {string} filePath - Path to the file to read
 * @returns {string} File content
 * @throws {Error} If file cannot be read
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Copies text to clipboard using clipboardy
 * 
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  // Using dynamic import for ESM-only clipboardy package
  // Alternative: Install clipboardy@2.3.0 for CommonJS support
  const clipboardy = await import('clipboardy');
  await clipboardy.default.write(text);
}

/**
 * Main CLI workflow
 */
async function main() {
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║         SilentBob CLI Tool             ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════╝\n'));

  // Step 1: Detect modified files
  console.log(chalk.blue('→ Detecting modified files in tests/modify/js/...\n'));
  const modifiedFiles = detectChanges();

  if (modifiedFiles.length === 0) {
    console.log(chalk.yellow('✓ No modified .js files found in tests/modify/js/'));
    console.log(chalk.gray('  Nothing to process. Exiting...\n'));
    process.exit(0);
  }

  console.log(chalk.green(`✓ Found ${modifiedFiles.length} modified file(s):\n`));
  modifiedFiles.forEach(file => {
    console.log(chalk.gray(`  • ${file}`));
  });
  console.log();

  // Step 2: Ask user which file to process
  const { selectedFile } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedFile',
      message: 'Which file would you like to process?',
      choices: modifiedFiles.map(file => ({
        name: file,
        value: file
      })),
      pageSize: 10
    }
  ]);

  console.log(chalk.blue(`\n→ Selected: ${selectedFile}\n`));

  // Step 2.5: Read persona and source code, copy to clipboard
  try {
    console.log(chalk.blue('→ Preparing prompt for clipboard...\n'));
    
    // Read prompt_persona.txt
    const personaPath = path.join(__dirname, 'prompt_persona.txt');
    const personaContent = readFileContent(personaPath);
    
    // Read selected file source code
    const sourceCode = readFileContent(selectedFile);
    
    // Concatenate: persona first, then source code
    const combinedPrompt = `${personaContent}\n\n${'='.repeat(80)}\n\nFILE: ${selectedFile}\n\n${sourceCode}`;
    
    // Copy to clipboard
    await copyToClipboard(combinedPrompt);
    
    // Success message
    console.log(chalk.green.bold('✅ Prompt successfully copied to clipboard!\n'));
    console.log(chalk.yellow('┌─────────────────────────────────────────────────────────┐'));
    console.log(chalk.yellow('│  Please paste it into this chat to generate the code,   │'));
    console.log(chalk.yellow('│  apply the changes to your file, and save.              │'));
    console.log(chalk.yellow('└─────────────────────────────────────────────────────────┘\n'));
    
  } catch (error) {
    console.error(chalk.red.bold('✗ Failed to copy to clipboard:'));
    console.error(chalk.red(`  ${error.message}\n`));
    console.log(chalk.yellow('  Please ensure clipboardy is installed:'));
    console.log(chalk.gray('  npm install clipboardy@2.3.0\n'));
    process.exit(1);
  }

  // Step 3: Ask user to confirm completion
  await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ready',
      message: 'Have you completed the documentation and test generation?',
      default: true
    }
  ]);

  // Step 4: Run tests
  const testFilePath = getTestFilePath(selectedFile);
  console.log(chalk.blue(`\n→ Running tests for: ${testFilePath}\n`));
  console.log(chalk.gray('  Please wait...\n'));

  const result = await runTests(testFilePath);

  // Step 5: Display results
  console.log(chalk.cyan('─'.repeat(60)));
  console.log(chalk.cyan.bold('Test Results'));
  console.log(chalk.cyan('─'.repeat(60)) + '\n');

  if (result.success) {
    console.log(chalk.green.bold('✓ SUCCESS'));
    console.log(chalk.green('  All tests passed!\n'));
    console.log(chalk.gray(`  File: ${selectedFile}`));
    console.log(chalk.gray(`  Tests: ${testFilePath}\n`));
    console.log(chalk.cyan('─'.repeat(60)) + '\n');
    process.exit(0);
  } else {
    console.log(chalk.red.bold('✗ FAILURE'));
    console.log(chalk.red('  Tests failed with the following error:\n'));
    console.log(chalk.red('─'.repeat(60)));
    console.log(chalk.red(result.error));
    console.log(chalk.red('─'.repeat(60)) + '\n');
    console.log(chalk.yellow('  Please review and fix the issues, then run again.\n'));
    console.log(chalk.cyan('─'.repeat(60)) + '\n');
    process.exit(1);
  }
}

// Execute main function
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red.bold('\n✗ Fatal Error:'));
    console.error(chalk.red(error.message));
    console.error(chalk.gray(error.stack));
    process.exit(1);
  });
}

module.exports = { main, getTestFilePath, readFileContent, copyToClipboard };

// Made with Bob
