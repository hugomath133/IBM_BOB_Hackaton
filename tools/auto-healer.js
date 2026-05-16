#!/usr/bin/env node

/**
 * SilentBob - Auto Healer
 * 
 * Runs Jest tests and extracts clean error messages for failed tests
 * 
 * @module auto-healer
 */

const { exec } = require('child_process');
const path = require('path');

/**
 * Extracts the core Jest error message from test output
 * 
 * @param {string} output - Raw Jest output containing error information
 * @returns {string} Cleaned error message
 */
function extractJestError(output) {
  // Remove ANSI color codes
  const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '');
  
  // Try to extract the main error message
  const errorPatterns = [
    /● (.+?)(?=\n\n|$)/s,
    /FAIL (.+?)(?=\n\n|$)/s,
    /Error: (.+?)(?=\n\n|$)/s,
    /Expected (.+?)(?=\n\n|$)/s,
    /Received (.+?)(?=\n\n|$)/s
  ];
  
  for (const pattern of errorPatterns) {
    const match = cleanOutput.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  
  // If no specific pattern matches, return first meaningful lines
  const lines = cleanOutput.split('\n').filter(line => line.trim().length > 0);
  const meaningfulLines = lines.slice(0, 10).join('\n');
  
  return meaningfulLines || 'Test failed with unknown error';
}

/**
 * Runs Jest tests for a specific test file
 * 
 * @param {string} testFilePath - Path to the test file to run
 * @returns {Promise<{success: boolean, error: string}>} Test result with success status and error message
 * 
 * @example
 * const result = await runTests('tests/modify/js/calculator.test.js');
 * if (!result.success) {
 *   console.error('Test failed:', result.error);
 * }
 */
function runTests(testFilePath) {
  return new Promise((resolve) => {
    const normalizedPath = path.normalize(testFilePath);
    const command = `npx jest "${normalizedPath}" --no-coverage --verbose`;
    
    exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const combinedOutput = stdout + stderr;
        const errorMessage = extractJestError(combinedOutput);
        
        resolve({
          success: false,
          error: errorMessage
        });
      } else {
        resolve({
          success: true,
          error: ''
        });
      }
    });
  });
}

module.exports = { runTests, extractJestError };

// If run directly from command line
if (require.main === module) {
  const testFile = process.argv[2];
  
  if (!testFile) {
    console.error('Usage: node auto-healer.js <test-file-path>');
    process.exit(1);
  }
  
  runTests(testFile).then(result => {
    if (result.success) {
      console.log('✓ Tests passed');
      process.exit(0);
    } else {
      console.error('✗ Tests failed');
      console.error('\nError:');
      console.error(result.error);
      process.exit(1);
    }
  });
}

// Made with Bob
