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

For this upgrade exercise, you have two options:

1. **Recommended: Use the Reference App** - Start with the complete reference app from the `reference/RnlConfApp-Final` folder in this repository. This is a fully-featured TV streaming app that demonstrates best practices and provides a solid foundation for testing the upgrade.

2. **Use Your Own App** - If you have an existing Vega app you'd like to upgrade, you can use that instead. This is a good option if you want to see how the upgrade process works with your specific codebase.

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

### If Using the Reference App

Copy the reference app to a new working directory:

```bash
# From the workshop root directory
cp -r reference/RnlConfApp-Final ~/vega-rn83-upgrade
cd ~/vega-rn83-upgrade

# Initialize git if not already a repository
git init
git add .
git commit -m "Initial commit - Reference app before RN 0.83 upgrade"
```

### If Using Your Own App

Ensure your project is in a clean state:

```bash
# Commit any pending changes
git add .
git commit -m "Pre-upgrade checkpoint"

# Create a new branch for the upgrade
git checkout -b upgrade-rn-0.83
```

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

Alternatively, you can ask directly:
```
Help me upgrade my application to RN 0.83
```

or

```
Upgrade my Vega app from React Native [current-version] to 0.83
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

## Step 5: Install Dependencies

After the upgrade helper updates your `package.json`:

```bash
npm install
# or
yarn install
```

## Step 6: Test the Upgrade

Build and deploy your app to verify the upgrade:

```bash
# Clean build
vega clean

# Build the app
vega build

# Install on your device
vega install --device <device-id>
```

### Build Error Assistance

If you encounter build errors, the upgrade helper can assist:

1. **Report the error** - Type `build` in the interactive session or paste the error output
2. **AI Analysis** - The helper searches Vega-specific build error knowledge
3. **Automatic Fixes** - For known issues, the AI may fix them automatically
4. **Guided Resolution** - For other issues, you'll get troubleshooting steps

The helper uses knowledge-grounded solutions (no guessing) and will direct you to external resources if the error isn't in the knowledge base.

## Step 7: Validate Functionality

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

If you encounter build errors:
1. Clear the Metro cache: `vega clean`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check for incompatible dependencies in `package.json`

### Runtime Errors

If the app crashes or behaves unexpectedly:
1. Check the device logs: `vega log --device <device-id>`
2. Review deprecated API usage flagged by the AI
3. Test on Vega Virtual Device for easier debugging

### Focus Management Issues

RN 0.83 may have changes to focus behavior:
1. Review `TVFocusGuideView` usage
2. Test D-pad navigation thoroughly
3. Check focus indicators are rendering correctly

## Verification Checklist

- [ ] App builds without errors
- [ ] App installs and launches successfully
- [ ] All screens are accessible via navigation
- [ ] Media playback works correctly
- [ ] D-pad navigation and focus management work as expected
- [ ] No console warnings about deprecated APIs
- [ ] Performance is equal to or better than before

## Next Steps

After successfully upgrading to RN 0.83:

1. **Performance Testing** - Run benchmarks to measure improvements
2. **Feature Exploration** - Explore new RN 0.83 features applicable to TV apps
3. **Documentation** - Document any app-specific migration notes for your team
4. **Rollout** - Plan your production deployment strategy

## Additional Resources

- [React Native 0.83 Release Notes](https://github.com/facebook/react-native/releases)
- [Vega Developer Documentation](https://developer.amazon.com/apps-and-games/vega)

## Troubleshooting

If you encounter issues during the upgrade:

1. Ask your AI assistant specific questions about errors
2. Check the Vega Developer Portal for known issues
3. Review the `react_native_for_vega_version_specific_knowledge_base.md` document
4. Reach out to the Vega developer community

## Summary

You've successfully upgraded your Vega app to React Native 0.83 using AI-assisted workflows. This process demonstrates how AI tools can streamline complex migration tasks while ensuring best practices are followed.

Remember that RN 0.83 for Vega is still in preview, so keep an eye on the Vega Developer Portal for updates and the official public release announcement later this year. Once released publicly, you'll be able to submit your upgraded app to the Amazon Appstore.
