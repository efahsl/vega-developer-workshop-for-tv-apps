# Shaka Player Upgrade

In this exercise, you'll download a sample video app that uses Shaka Player, verify it runs on your Fire TV device, then use the Amazon Devices Builder Tools MCP server to check for a newer Shaka Player version and upgrade it.

## Prompts at a Glance

This exercise requires **4 prompts** to your AI agent, plus **1 manual action** (downloading a file). Here's the full sequence:

| # | Type | What You Do |
|---|------|-------------|
| 🤖 Prompt 1 | AI Agent | `Clone https://github.com/AmazonAppDev/vega-video-sample, install dependencies, build, and run the app on my Fire TV device` |
| 🤖 Prompt 2 | AI Agent | `What Shaka Player versions are available for Vega? Is there a newer version than what this app is using?` |
| 🤖 Prompt 3 | AI Agent | `Upgrade the Shaka Player in this app to the latest available Vega version` |
| 👤 Manual | You | Download the `.tar.gz` file from the link Kiro/AI-agent provides, then tell Kiro/AI-agent the local path |
| 🤖 Prompt 4 | AI Agent | `The file is at ~/Downloads/shaka-rel-v4.8.5-r1.5.tar.gz. Extract it, replace the Shaka Player dist, then clean build and run the app on my Fire TV device` |

## Prerequisites

Before starting this exercise, make sure you have:

- [ ] Completed [Prerequisites](0_prerequisites.md) and verified the MCP server is connected
- [ ] A physical Fire TV device connected via ADB (Fire TV Stick, Fire TV Cube, etc.)
- [ ] Java Runtime Environment (JRE) or Java Development Kit (JDK) — required by Shaka Player's build system
- [ ] Python — required by Shaka Player's build scripts

---

## Step 1: Download, Build, and Run the Vega Video Sample App

The [Vega Video Sample App](https://github.com/AmazonAppDev/vega-video-sample) is a production-ready streaming app that uses Shaka Player for adaptive streaming (HLS/DASH) with DRM support.

### 🤖 Prompt 1

Copy and paste this into your AI agent's chat:

```
Clone https://github.com/AmazonAppDev/vega-video-sample, install dependencies, build, and run the app on my Fire TV device
```

The AI agent will:
1. Clone the repository
2. Run `npm install` and `npm run build:app`
3. Deploy and launch the app on your connected Fire TV device

> **Note:** If you encounter build errors related to Java or Python, install the missing prerequisites and ask the agent to retry.

**🏁 Checkpoint:** The app should launch and display a home screen with video content. Navigate to a video and verify playback works.

---

## Step 2: Check for Shaka Player Updates via MCP

Now use your AI agent with the MCP server to find out if there's a newer version of Shaka Player available for Vega.

### 🤖 Prompt 2

Copy and paste this into your AI agent's chat:

```
What Shaka Player versions are available for Vega? Is there a newer version than what this app is using?
```

The AI agent will use the MCP server to read the Vega media player documentation and identify available Shaka Player versions. At the time of writing, the available Vega-patched versions are:

| Version | Latest Patch | Key Features |
|---------|-------------|--------------|
| **4.8.5** | r1.5 | DTS audio, TTML playback, MPEG2 video codec, AV sync fixes |
| **4.6.18** | r2.16 | Codec switch fixes, stability improvements, DASH nativization fixes |
| **4.3.6** | r2.5 | Headless JS playback support, updated polyfills |

### 🤖 Prompt 3

If a newer version is available, copy and paste this:

```
Upgrade the Shaka Player in this app to the latest available Vega version
```

The AI agent will look up the Vega documentation and provide you with a download link for the Shaka Player Vega patch (e.g., `shaka-rel-v4.8.5-r1.5.tar.gz`).

### 👤 Manual Download (Required)

> ⚠️ **The AI agent cannot download this file automatically.** When Kiro/AI-agent provides the download link:
>
> 1. **Open the link** in your browser and download the `.tar.gz` file to a local folder (e.g., `~/Downloads/`)
> 2. **Tell Kiro/AI-agent the path** where you saved it (see Prompt 4 below)

---

## Step 3: Build and Run the Upgraded App

### 🤖 Prompt 4

Once you've downloaded the file, copy and paste this (update the path if needed):

```
The file is at ~/Downloads/shaka-rel-v4.8.5-r1.5.tar.gz. Extract it, replace the Shaka Player dist, then clean build and run the app on my Fire TV device
```

The AI agent will:
1. Extract the package and run the setup script to generate the `dist` folder
2. Replace the existing `src/shakaplayer/dist` folder with the newly generated one
3. Update any adapter code if needed for the new version
4. Run a clean build (`rm -rf build node_modules && npm install && npm run build:app`)
5. Deploy and launch the upgraded app on your Fire TV device

> **Important:** Per Vega guidelines, always generate the Shaka Player `dist` folder from the Vega-specific release. Do not use the upstream Shaka Player npm package directly. Run the dist generation outside the app root directory to avoid build environment conflicts.

**🏁 Checkpoint:** Verify the following after the upgrade:
- ✅ App launches without errors
- ✅ Video playback works (navigate to a video and play it)
- ✅ Adaptive streaming switches quality based on network conditions
- ✅ No regressions in playback controls (play, pause, seek)

---

**Previous:** [Crash Debugging](3_diagnose_crashes_with_ai_assistance.md)
