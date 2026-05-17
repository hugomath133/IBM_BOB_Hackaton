# Install and configure IBM Bob

This document explains how to install IBM Bob, create an IBMid account, sign in to the application, and verify that the environment is ready to use.

## 1. Prerequisites

Before starting, make sure the workstation meets the following prerequisites:

| Item | Requirement |
|---|---|
| Operating system | macOS, Linux, or Windows |
| Memory | 4 GB RAM minimum, 8 GB recommended |
| Disk space | 500 MB minimum available |
| Network | Active Internet connection |
| Account | IBMid required to sign in to IBM Bob |

Recommended prerequisites depending on your usage:

- **Git**: recommended to clone or open code repositories.
- **Docker**: recommended if projects use containers or if Bob needs to run isolated builds.
- **Node.js 22.15.0 or later**: required only if you install or use **Bob Shell**.

## 2. Download IBM Bob

1. Go to the official download page: [https://bob.ibm.com/download](https://bob.ibm.com/download)
2. Select the version matching your operating system:
   - macOS
   - Linux
   - Windows
3. Download the installer.

## 3. Install IBM Bob

### macOS

1. Download the `.pkg` file from the download page.
2. Open the `.pkg` file.
3. Follow the installation wizard steps.
4. Launch IBM Bob from the Applications folder or with Spotlight.

### Windows

1. Download the `.exe` file from the download page.
2. Run the installer.
3. Follow the installation wizard steps.
4. Keep the default installation directory unless a specific location is required.
5. Click **Finish** at the end of the installation.
6. Launch IBM Bob from the Start menu or the created shortcut.

### Linux

1. Download the package matching your Linux distribution from [https://bob.ibm.com/download](https://bob.ibm.com/download).
2. Install the package using your distribution package manager:
   - Debian / Ubuntu: Debian-compatible package.
   - Red Hat / Fedora: RPM-compatible package.
3. Launch IBM Bob from the application menu or from the terminal, depending on the installation method.

> Note: if your company requires a specific installation method, follow the internal procedure provided by your IT team.

## 4. Create an IBMid account

IBM Bob requires an **IBMid** account for authentication.

1. Go to the account creation page: [Create an IBMid](https://www.ibm.com/account/reg/us-en/signup?formid=urx-19776)
2. Fill in the required information:
   - business email address;
   - first name;
   - last name;
   - company.
3. Validate the email address using the code received by email.
4. Keep the email address used during registration: it will be your **IBMid** for signing in.

If you already have an IBM account, use the existing sign-in option instead of creating a new account.

## 5. First sign-in to IBM Bob

1. Open the IBM Bob application.
2. On first launch, click the sign-in option.
3. Follow the authentication flow in the browser.
4. Sign in with your IBMid.
5. After authentication is complete, return to IBM Bob.

After signing in, the IBM Bob interface should be available, including the Bob chat panel.

## 6. Verify the installation

To confirm that the installation works correctly:

1. Open IBM Bob.
2. Open a local project folder or clone a Git repository.
3. Open the Bob panel if needed.
4. Send a simple first request, for example:

```text
Explain the structure of this project.
```

5. Check that Bob answers and can read the project context.

## 7. Recommended project setup

### Initialize Bob in the project

In a project, it is recommended to initialize Bob so it can better understand the repository structure, conventions, and rules.

In the Bob chat panel, run:

```text
/init
```

Bob may suggest creating rule files such as `AGENTS.md` or configuration files in the `.bob` directory.

### Choose the right mode

IBM Bob provides several modes depending on the task:

| Mode | Recommended usage |
|---|---|
| Ask | Ask questions or analyze code without making changes |
| Plan | Prepare a plan before changing code |
| Code | Write, modify, or refactor code |
| Advanced | Use advanced capabilities or deeper integrations |
| Orchestrator | Coordinate complex multi-step tasks |

Best practices:

- use **Ask** to understand a project;
- use **Plan** before an important change;
- use **Code** only when the plan is clear;
- review proposed changes before applying them.

## 8. Security and best practices

### Protect sensitive files

Create a `.bobignore` file at the project root to prevent Bob from accessing sensitive files.

Example:

```gitignore
.env
secrets/
*.key
config/credentials.json
node_modules/
dist/
build/
```

Also add sensitive files to `.gitignore` if this has not already been done.

### Do not share secrets

Never paste the following into Bob:

- passwords;
- API keys;
- access tokens;
- private certificates;
- configuration files containing credentials.

### Limit auto-approval

If an auto-approval option is available, avoid enabling it by default on sensitive projects.

Recommendation:

- keep manual validation for actions that modify files;
- keep manual validation for shell commands;
- review changes before accepting them.

## 9. Network, proxy, and firewall

In a corporate environment, IBM Bob may require a specific network configuration.

### In case of connection errors

Possible symptoms:

- Bob cannot connect;
- network timeout;
- SSL error;
- browser authentication failure.

Checks to perform:

1. Confirm that the workstation has Internet access.
2. Check whether a corporate proxy is required.
3. Ask the IT team to validate the required network access.
4. Restart IBM Bob after changing network settings.

### Proxy configuration

In IBM Bob:

1. Open settings:
   - macOS: `Cmd + ,`
   - Windows / Linux: `Ctrl + ,`
2. Search for `proxy`.
3. Enter the proxy URL if required, for example:

```text
http://proxy.example.com:8080
```

4. Restart IBM Bob.
5. Test a conversation in the Bob panel.

> If the proxy uses a specific SSL certificate, contact the security team before disabling strict SSL validation.

## 10. Install Bob Shell, optional

Bob Shell lets you use Bob from the terminal. This step is optional.

Additional prerequisite: **Node.js 22.15.0 or later**.

### macOS / Linux

```bash
curl -fsSL https://bob.ibm.com/download/bobshell.sh | bash
```

### Windows PowerShell

```powershell
powershell -ep Bypass 'irm -Uri "https://bob.ibm.com/download/bobshell.ps1" | iex'
```

During first use, Bob Shell will also request authentication with IBMid through the browser.

## 11. Quick troubleshooting

| Issue | What to check |
|---|---|
| Cannot sign in | Check the IBMid, Internet connection, browser, and proxy |
| Bob does not answer | Restart the application and check network access |
| SSL error | Check proxy/certificate configuration with the IT team |
| Bob cannot see some files | Check `.bobignore` and the folder opened in the IDE |
| Bob suggests risky changes | Reject the action, switch back to Ask or Plan mode, then rephrase the request |

## 12. Useful links

- Download IBM Bob: [https://bob.ibm.com/download](https://bob.ibm.com/download)
- Create an IBMid: [https://www.ibm.com/account/reg/us-en/signup?formid=urx-19776](https://www.ibm.com/account/reg/us-en/signup?formid=urx-19776)
- IBM Bob documentation: [https://bob.ibm.com/docs](https://bob.ibm.com/docs)
- IBM Bob IDE installation: [https://bob.ibm.com/docs/ide/getting-started/install](https://bob.ibm.com/docs/ide/getting-started/install)
- Bob Shell installation: [https://bob.ibm.com/docs/shell/getting-started/install-and-setup](https://bob.ibm.com/docs/shell/getting-started/install-and-setup)
- Best practices: [https://bob.ibm.com/docs/ide/getting-started/best-practices](https://bob.ibm.com/docs/ide/getting-started/best-practices)
- Security guidance: [https://bob.ibm.com/docs/ide/security/bob-security-guidance](https://bob.ibm.com/docs/ide/security/bob-security-guidance)