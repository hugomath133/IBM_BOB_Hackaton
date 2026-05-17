# SilentBob Usage Guide

This document explains how to install, run, and use the **SilentBob** CLI workflow with IBM Bob.

SilentBob is a small Node.js command-line tool that helps you process modified source files with IBM Bob. It detects changed files, builds a ready-to-use IBM Bob prompt, copies that prompt to your clipboard, and then runs Jest tests to validate the result after you apply IBM Bob's generated code.

---

## 1. What SilentBob does

SilentBob automates the manual workflow between a local repository and IBM Bob:

1. It detects modified or newly created files in `tests/modify/js/`.
2. It lets you choose the file you want to process.
3. It reads the selected source file.
4. It combines the source code with the persona prompt from `tools/prompt_persona.txt`.
5. It copies the complete prompt to your clipboard.
6. You paste the prompt into IBM Bob.
7. IBM Bob generates documented code and a Jest unit test file.
8. You apply the generated code locally and save the files.
9. SilentBob runs the related Jest test file.
10. If tests fail, SilentBob creates a healing prompt and copies it to the clipboard so IBM Bob can fix the code.

---

## 2. Prerequisites

Before using the program, make sure you have:

| Requirement | Purpose |
|---|---|
| Node.js and npm | Required to install dependencies and run the CLI |
| Git | Required because SilentBob detects changes through Git commands |
| IBM Bob installed | Required to generate the code and tests from the copied prompt |
| IBMid account | Required to sign in to IBM Bob |
| A terminal | Required to run the SilentBob CLI |

IBM Bob can be downloaded here:

```text
https://bob.ibm.com/download
```

After installing IBM Bob, sign in with your IBMid before starting the workflow.

---

## 3. Project structure

The project contains the following important files and folders:

```text
IBM_BOB_Hackaton/
├── package.json
├── package-lock.json
├── README.md
├── tools/
│   ├── silentbob.js
│   ├── detect-changes.js
│   ├── auto-healer.js
│   └── prompt_persona.txt
├── tests/
│   ├── base/
│   │   └── js/
│   └── modify/
│       └── js/
└── bob_sessions/
```

### Main files

| File | Description |
|---|---|
| `package.json` | Defines the project scripts and dependencies |
| `tools/silentbob.js` | Main interactive CLI entry point |
| `tools/detect-changes.js` | Detects changed files with Git |
| `tools/auto-healer.js` | Runs Jest tests and extracts failure messages |
| `tools/prompt_persona.txt` | Persona prompt sent to IBM Bob |
| `tests/base/js/` | Reference source files |
| `tests/modify/js/` | Files that should be modified and processed by SilentBob |

---

## 4. Installation

From the project root, install the dependencies:

```bash
npm install
```

This installs the required packages:

- `chalk` for colored terminal output;
- `clipboardy` for clipboard copy support;
- `inquirer` for interactive terminal prompts;
- `jest` for running unit tests.

---

## 5. Start the program

From the project root, run:

```bash
npm start
```

This executes:

```bash
node tools/silentbob.js
```

SilentBob then opens an interactive terminal menu.

---

## 6. Prepare a file before running the workflow

SilentBob only lists files that are modified or newly created in this directory:

```text
tests/modify/js/
```

The detection is based on Git:

- modified tracked files are detected with `git diff --name-only`;
- new untracked files are detected with `git ls-files --others --exclude-standard`.

That means a clean repository may show:

```text
No modified .js files found in tests/modify/js/
```

To make a file appear in SilentBob, edit or create a file under `tests/modify/js/`.

Example:

```text
tests/modify/js/calculator.js
```

After saving the change, run or refresh SilentBob.

---

## 7. Select the file to process

When SilentBob detects one or more modified files, it displays a list such as:

```text
Found 1 modified file(s):

  • tests/modify/js/calculator.js
```

You can then choose:

- `Refresh list` to scan files again;
- `Exit` to close the program;
- one of the detected files to start the IBM Bob workflow.

Select the file you want IBM Bob to process.

---

## 8. What gets copied to the clipboard

After you select a file, SilentBob prepares a prompt and copies it to your clipboard.

The copied prompt contains:

1. the content of `tools/prompt_persona.txt`;
2. a separator line;
3. the selected file path;
4. the full source code of the selected file.

The persona currently asks IBM Bob to:

- act as a strict Senior QA and Documentation Engineer;
- add clean JSDoc or docstrings to every function;
- generate a complete Jest unit test file;
- cover happy paths and edge cases;
- output only the documented code followed by the test code.

When the copy succeeds, SilentBob displays:

```text
Prompt successfully copied to clipboard!
```

---

## 9. Send the prompt to IBM Bob

Open IBM Bob and paste the copied prompt into the Bob chat input.

Then send the message to IBM Bob.

IBM Bob should return two parts:

1. the updated source code with documentation;
2. the Jest unit test code.

The expected source file is the file you selected in SilentBob.

Example:

```text
tests/modify/js/calculator.js
```

The expected test file should be created next to it with the `.test.js` suffix.

Example:

```text
tests/modify/js/calculator.test.js
```

---

## 10. Apply IBM Bob's result locally

After IBM Bob finishes generating the answer:

1. Copy the documented source code from IBM Bob.
2. Replace the content of the selected source file.
3. Copy the generated Jest test code.
4. Create or update the related test file.
5. Save both files.

Example for `calculator.js`:

```text
tests/modify/js/calculator.js
tests/modify/js/calculator.test.js
```

Be careful to keep only valid JavaScript in the files. Do not paste Markdown fences such as:

````text
```javascript
````

or:

````text
```
````

The files must contain code only.

---

## 11. Confirm completion in the terminal

After saving the generated code and test file, return to the terminal running SilentBob.

The program asks you to confirm that the files are ready.

Depending on the prompt shown in the terminal:

- press `Enter` when SilentBob asks you to continue;
- type `y` or press `Enter` when SilentBob asks for a yes/no confirmation and the default answer is yes.

SilentBob will then run the tests automatically.

---

## 12. Test execution

SilentBob calculates the test file path from the selected source file.

Example:

| Selected source file | Test file executed |
|---|---|
| `tests/modify/js/calculator.js` | `tests/modify/js/calculator.test.js` |
| `tests/modify/js/stringUtils.js` | `tests/modify/js/stringUtils.test.js` |
| `tests/modify/js/userManagement.js` | `tests/modify/js/userManagement.test.js` |

Internally, SilentBob runs:

```bash
npx jest "<test-file-path>" --no-coverage --verbose
```

Example:

```bash
npx jest "tests/modify/js/calculator.test.js" --no-coverage --verbose
```

If all tests pass, SilentBob displays a success message and returns to the main menu.

---

## 13. Auto-healing workflow when tests fail

If the tests fail, SilentBob automatically creates a new prompt for IBM Bob.

The healing prompt contains:

- the Jest error message;
- the current source code;
- the test code;
- an instruction asking IBM Bob to fix the code so the tests pass.

SilentBob copies this healing prompt to your clipboard.

Then:

1. Go back to IBM Bob.
2. Paste the healing prompt.
3. Send it to IBM Bob.
4. Apply the fixed code locally.
5. Save the file.
6. Return to the terminal.
7. Confirm that you are ready to rerun the tests.

When SilentBob asks:

```text
Ready to re-run the tests?
```

Type:

```text
y
```

or press `Enter` if `Yes` is selected by default.

SilentBob reruns the same Jest test file.

This loop continues until:

- the tests pass; or
- you choose not to rerun the tests.

---

## 14. Full usage example

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Modify a file

Edit:

```text
tests/modify/js/calculator.js
```

Save the file.

### Step 3: Start SilentBob

```bash
npm start
```

### Step 4: Select the file

Choose:

```text
tests/modify/js/calculator.js
```

SilentBob copies the prompt to the clipboard.

### Step 5: Use IBM Bob

Paste the prompt into IBM Bob and send it.

IBM Bob should generate:

```text
tests/modify/js/calculator.js
tests/modify/js/calculator.test.js
```

### Step 6: Save the result locally

Update or create both files with IBM Bob's answer.

### Step 7: Confirm in SilentBob

Return to the terminal and press `Enter`.

SilentBob runs:

```bash
npx jest "tests/modify/js/calculator.test.js" --no-coverage --verbose
```

### Step 8: Fix if needed

If tests fail, SilentBob copies a healing prompt to the clipboard.

Paste it into IBM Bob, apply the fix, save the file, and confirm the retest with `y`.

---

## 15. Available npm commands

| Command | Description |
|---|---|
| `npm install` | Installs project dependencies |
| `npm start` | Starts the SilentBob interactive CLI |
| `npm test` | Runs Jest without coverage |

---

## 16. Troubleshooting

### No files are displayed

Cause:

- no file was modified;
- the modified file is outside `tests/modify/js/`;
- the project is not detected as a Git repository.

Fix:

1. Modify or create a file in `tests/modify/js/`.
2. Save the file.
3. Check the Git status:

```bash
git status --short
```

4. Restart or refresh SilentBob.

### Clipboard copy fails

Cause:

- clipboard access is blocked;
- dependencies were not installed correctly;
- the environment does not support clipboard access.

Fix:

```bash
npm install
```

Then restart:

```bash
npm start
```

If the problem persists, copy the prompt manually by checking the selected source file and `tools/prompt_persona.txt`.

### Jest cannot find the test file

Cause:

- the `.test.js` file was not created;
- the test file name does not match the selected source file name;
- the test file was created in the wrong directory.

Fix:

For this source file:

```text
tests/modify/js/calculator.js
```

create this test file:

```text
tests/modify/js/calculator.test.js
```

### Tests fail after IBM Bob generates code

Cause:

- the generated implementation does not match the tests;
- the test imports are incorrect;
- Markdown or explanations were pasted into the `.js` files;
- the generated test file uses the wrong path.

Fix:

1. Let SilentBob copy the healing prompt.
2. Paste it into IBM Bob.
3. Apply the fixed code.
4. Save the files.
5. Confirm the retest in the terminal.

### IBM Bob returns Markdown instead of code only

Fix:

Ask IBM Bob to return only raw JavaScript code, without Markdown fences, explanations, or comments outside the code.

You can use this instruction:

```text
Return only the raw JavaScript files. Do not include Markdown fences or explanations.
```

### The program says it is not a Git repository

Cause:

SilentBob uses Git commands to detect modified and untracked files.

Fix:

Run the program from the project root, where the `.git` folder exists:

```bash
cd IBM_BOB_Hackaton
npm start
```

---

## 17. Best practices

- Run `npm install` before the first use.
- Run `npm start` from the project root.
- Modify files only in `tests/modify/js/` when using the current workflow.
- Keep the original files in `tests/base/js/` unchanged unless you intentionally want to update the reference version.
- Make sure IBM Bob creates the matching `.test.js` file.
- Save all generated files before confirming in the terminal.
- Do not paste Markdown fences into source or test files.
- Use the healing prompt whenever tests fail.
- Commit your changes only after the tests pass.

---

## 18. Current limitations

The current version of SilentBob is mainly designed for JavaScript files under:

```text
tests/modify/js/
```

The change detector can detect `.js` and `.py` files, but the test runner is Jest-based and automatically expects a `.test.js` file. For this reason, the current workflow should be considered optimized for JavaScript.

The test file must be located next to the selected source file.

Example:

```text
tests/modify/js/stringUtils.js
tests/modify/js/stringUtils.test.js
```

---

## 19. Recommended workflow summary

Use this short version when you already know the process:

```bash
npm install
npm start
```

Then:

1. Select the modified file in the terminal.
2. Paste the copied prompt into IBM Bob.
3. Apply IBM Bob's generated source code and test code.
4. Save the files.
5. Return to the terminal.
6. Press `Enter` or type `y` when asked to confirm.
7. Let SilentBob run the tests.
8. If tests fail, paste the healing prompt into IBM Bob and repeat.

---

## 20. Useful links

- IBM Bob download: `https://bob.ibm.com/download`
- IBM Bob documentation: `https://bob.ibm.com/docs`