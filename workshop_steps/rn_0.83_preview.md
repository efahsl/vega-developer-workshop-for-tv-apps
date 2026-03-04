# React Native 0.83 Preview - Upgrade Your Vega App

This breakout session guides you through upgrading your Vega app to React Native 0.83, taking advantage of the latest features and improvements.

> **⚠️ Preview Release Notice**
>
> React Native 0.83 for Vega is currently in preview and under active development. While the upgrade process is functional, you may encounter some rough edges or issues that are still being resolved. Apps built with RN 0.83 cannot be submitted to the Amazon Appstore until the official public release later this year. This session is intended for exploration and early testing purposes.

## Prerequisites

- Completed the main workshop steps (1-5)
- A working Vega app to upgrade (see recommendations below)
- Vega SDK installed with RN 0.83 support (see [Prerequisites](0_prerequisites.md) for installation instructions)
- Basic understanding of React Native and Vega architecture

## Choosing Your Starting App

For this upgrade exercise, we recommend using the reference app:

**Recommended: Use the Reference App** - Start with the complete reference app from the `reference/RnlConfApp-Final` folder in this repository. This is a clean, working React Native 0.72 app that demonstrates best practices and provides a solid foundation for testing the upgrade process.

> **Note:** You can also try this upgrade on your own Vega app if you prefer to see how the process works with your specific codebase.

## What You'll Learn

- How to use the AI-assisted upgrade helper with interactive commands
- How the upgrade helper generates and manages TODO lists
- Version-specific configuration changes for RN 0.83
- Working with the checkpoint system to pause and resume upgrades
- Testing and validation after the upgrade
- Common migration issues and solutions

## Overview

React Native 0.83 brings performance improvements and new features to Vega apps. This session uses the AI-assisted upgrade helper from the Vega Developer Tools MCP server to handle the migration systematically.

The upgrade helper is specifically designed for Vega platform migrations and understands the unique requirements of TV apps, including manifest configurations, Vega-specific dependencies, and TV-optimized components.

## Step 1: Prepare Your Project

### Using the Reference App (Recommended)

If you've been following the workshop, you should already have this repository cloned. If not, clone the repository first.

Navigate to the reference app directory:

```bash
cd reference/RnlConfApp-Final
```

Ensure you have a clean git state:

```bash
# Check status
git status

# If there are uncommitted changes, commit or stash them
git add .
git commit -m "Pre-upgrade checkpoint"
```

> **Note:** If using your own app instead, navigate to your app directory and ensure your project is in a clean state with all changes committed before starting the upgrade.

## Step 2: Trigger the AI-Assisted Upgrade

The Vega Developer Tools MCP server includes a specialized upgrade helper designed specifically for React Native version migrations on Vega. This tool provides:

- **Vega-Specific Context** - Understands Vega platform requirements and constraints
- **Automated TODO Generation** - Creates a comprehensive checklist of upgrade tasks
- **Version-Specific Knowledge** - Loads configuration details specific to RN 0.83
- **Interactive Step-by-Step Guidance** - Walks you through each change with explanations
- **Checkpointing & Resume** - Save progress and resume the upgrade later if needed

### Triggering the Upgrade Helper

To start the upgrade, use your AI coding assistant and run the following prompt command:

**For Kiro / Claude Code / Cline:**
```
/prompt react_native_for_vega_ai_assisted_rn_upgrade
```

**Alternatively, ask directly:**
```
Use the React Native Upgrade workflow from @amazon-devices/amazon-devices-buildertools-mcp to upgrade my application to RN83.
```

The upgrade helper will:
1. Ask for your working directory (or detect it if you're already in the project)
2. Detect your current React Native version from `package.json`
3. Validate your project structure and environment
4. Load Vega-specific knowledge for RN 0.83
5. Generate a comprehensive TODO list of all required changes
6. Enter interactive mode where you can work through changes step-by-step

## Step 3: Review the Generated TODO List

The upgrade helper will automatically generate a comprehensive TODO file in your project directory named:

```
RN_UPGRADE_TODO_[current_version]_to_0.83.md
```

For example: `RN_UPGRADE_TODO_0.72_to_0.83.md`

**✅ Workshop Checkpoint:** Verify this file was created in your project directory. This is your success indicator that the upgrade helper initialized correctly.

The TODO list covers all aspects of the migration:

- **Dependencies** - Package version updates in `package.json`
- **Configuration Files** - Changes to Babel, Metro, and TypeScript configs
- **Manifest Updates** - Any required changes to `manifest.toml`
- **API Migrations** - Deprecated API replacements and new API adoptions
- **Vega-Specific Changes** - Updates to Vega libraries and TV-optimized components
- **Breaking Changes** - Code modifications needed for RN 0.83 compatibility

The TODO file includes:
- Progress tracking with checkboxes (⭕ pending, ✅ completed)
- Priority indicators (🔴 Critical, 🟡 High, 🟢 Medium, 🔵 Low)
- Detailed implementation steps for each change
- Code examples and file references
- Links to relevant documentation

> **Note:** One of the TODO items will guide you to run `npm install` to update dependencies. The upgrade helper will assist with this step and help troubleshoot any installation errors.

Review this list to understand the scope of changes before proceeding. The upgrade helper will work through each item systematically.

## Step 4: Work Through Changes Interactively

The upgrade helper enters an interactive mode with a command-based interface. You'll see a menu showing all pending changes organized by priority.

### Interactive Commands

The helper provides these commands:

- **[1-N]** - Select a change by number to view complete implementation guide
  - Shows detailed steps, code examples, and affected files
  - For simple changes, AI may offer to implement automatically
  - For complex changes, you'll implement manually

- **complete** - Mark the current change as done (after manual implementation)
  - Updates the TODO file with ✅
  - Tracks your progress automatically

- **status** - View detailed progress report
  - See completion stats by priority
  - View remaining work breakdown

- **help** - Show command reference

- **exit** - Save progress and exit
  - Creates a checkpoint file (`.rn-upgrade-checkpoint.json`)
  - You can resume later by running the upgrade command again

### Workflow Example

1. The helper displays pending changes grouped by priority (🔴 Critical, 🟡 High, etc.)
2. Type a number (e.g., `1`) to select a change
3. Review the implementation guide with detailed steps
4. Choose one of two paths:
   - **AI Implementation**: If it's a simple change, accept the AI's offer to implement it (auto-completes)
   - **Manual Implementation**: Implement the change yourself, then type `complete` to mark it done
5. Repeat for remaining changes

### Progress Tracking

The helper automatically:
- Updates the TODO file as you complete changes
- Shows visual progress bars
- Saves checkpoints so you can pause and resume anytime
- Celebrates milestones (25%, 50%, 75%, 100%)

You can pause at any time and resume later - your progress is saved automatically in `.rn-upgrade-checkpoint.json`.

## Step 5: Build and Test the Upgrade

Once you've completed the upgrade changes, you can build and test your app using AI assistance.

> **Note:** For more detailed information about building and testing Vega apps, see [Create a 3 Screen App](3_create_3_screen_app.md).

### AI-Driven Build and Test

Simply ask your AI assistant:

```
Build and run this app on the connected Vega device
```

The AI will handle the build process, deployment, and launch automatically.

### Build Error Assistance

If you encounter build errors, the upgrade helper can assist:

1. **Report the error** - Type `build` in the interactive session or paste the error output
2. **AI Analysis** - The helper searches Vega-specific build error knowledge
3. **Automatic Fixes** - For known issues, the AI may fix them automatically
4. **Guided Resolution** - For other issues, you'll get troubleshooting steps

The helper uses knowledge-grounded solutions (no guessing) and will direct you to external resources if the error isn't in the knowledge base.

## Step 6: Validate Functionality

Test critical app features:

- Navigation between screens
- Media playback
- Focus management and D-pad navigation
- Any custom components or integrations

## Common Issues and Solutions

### Resuming an Upgrade Session

If you need to pause and resume:
1. Type `exit` in the interactive session to save your progress
2. The helper creates `.rn-upgrade-checkpoint.json` in your project directory
3. Run the upgrade command again - it will detect the checkpoint and ask if you want to resume
4. Your TODO file tracks all completed changes with ✅ markers

### Build Errors

If you encounter build errors, the upgrade helper with MCP can help walk you through the problems and provide solutions.

You can also try these manual troubleshooting steps:
1. Clear the Metro cache: `vega clean`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check for incompatible dependencies in `package.json`

## Additional Resources

- [React Native 0.83 Release Notes](https://github.com/facebook/react-native/releases)
- [Vega Developer Documentation](https://developer.amazon.com/apps-and-games/vega)

## Summary

You've successfully upgraded your Vega app to React Native 0.83 using AI-assisted workflows. This process demonstrates how AI tools can streamline complex migration tasks while ensuring best practices are followed.

Remember that RN 0.83 for Vega is still in preview, so keep an eye on the Vega Developer Portal for updates and the official public release announcement later this year. Once released publicly, you'll be able to submit your upgraded app to the Amazon Appstore.
