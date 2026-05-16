#!/usr/bin/env node

/**
 * SilentBob - Detect Changes
 * 
 * A tool to detect modified and newly added JavaScript and Python files
 * in a Git repository using git commands.
 * 
 * @module detect-changes
 */

const { execSync } = require('child_process');
const path = require('path');

/**
 * Executes a git command and returns the output as an array of lines
 * 
 * @param {string} command - The git command to execute
 * @returns {string[]} Array of file paths from the command output
 * @throws {Error} If the command fails
 */
function executeGitCommand(command) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    return output
      .trim()
      .split('\n')
      .filter(line => line.length > 0);
  } catch (error) {
    // Return empty array if command fails (e.g., no changes, not a git repo)
    return [];
  }
}

/**
 * Checks if the current directory is a git repository
 * 
 * @returns {boolean} True if inside a git repository, false otherwise
 */
function isGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Filters an array of file paths to only include .js and .py files
 *
 * @param {string[]} files - Array of file paths
 * @returns {string[]} Filtered array containing only .js and .py files
 */
function filterByExtension(files) {
  const allowedExtensions = ['.js', '.py'];
  
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return allowedExtensions.includes(ext);
  });
}

/**
 * Filters an array of file paths to only include files in tests/modify/js/ directory
 *
 * @param {string[]} files - Array of file paths
 * @returns {string[]} Filtered array containing only files in tests/modify/js/
 */
function filterByDirectory(files) {
  const targetDirectory = 'tests/modify/js/';
  
  return files.filter(file => {
    // Normalize path separators for cross-platform compatibility
    const normalizedFile = file.replace(/\\/g, '/');
    return normalizedFile.startsWith(targetDirectory);
  });
}

/**
 * Removes duplicate entries from an array
 * 
 * @param {string[]} array - Array with potential duplicates
 * @returns {string[]} Array with unique values only
 */
function removeDuplicates(array) {
  return [...new Set(array)];
}

/**
 * Detects modified and newly added .js and .py files in the tests/modify/js/ directory
 *
 * This function executes two git commands:
 * 1. git diff --name-only - to find modified tracked files
 * 2. git ls-files --others --exclude-standard - to find new untracked files
 *
 * Only files located in tests/modify/js/ directory are returned.
 * Files in other directories (e.g., tests/base/js/) are filtered out.
 *
 * @returns {string[]} Array of file paths for modified or newly added .js and .py files in tests/modify/js/
 *
 * @example
 * const changedFiles = detectChanges();
 * console.log(changedFiles);
 * // Output: ['tests/modify/js/app.js', 'tests/modify/js/helper.py']
 */
function detectChanges() {
  // Check if we're in a git repository
  if (!isGitRepository()) {
    console.error('Error: Not a git repository');
    return [];
  }

  try {
    // Get modified tracked files
    const modifiedFiles = executeGitCommand('git diff --name-only');
    
    // Get new untracked files
    const untrackedFiles = executeGitCommand('git ls-files --others --exclude-standard');
    
    // Combine both arrays
    const allChangedFiles = [...modifiedFiles, ...untrackedFiles];
    
    // Filter to only .js and .py files
    const filteredFiles = filterByExtension(allChangedFiles);
    
    // Filter to only files in tests/modify/js/ directory
    const directoryFilteredFiles = filterByDirectory(filteredFiles);
    
    // Remove any duplicates
    const uniqueFiles = removeDuplicates(directoryFilteredFiles);
    
    return uniqueFiles;
  } catch (error) {
    console.error('Error detecting changes:', error.message);
    return [];
  }
}

// Export the main function
module.exports = detectChanges;

// If run directly from command line, execute and print results
if (require.main === module) {
  const changes = detectChanges();
  
  if (changes.length === 0) {
    console.log('No .js or .py files have been modified or added in tests/modify/js/.');
  } else {
    console.log('Detected changes in tests/modify/js/:');
    changes.forEach(file => console.log(`  - ${file}`));
  }
}

// Made with Bob
