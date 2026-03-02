# Phase 1: Clone and Run the Workshop App

In this workshop we'll use a pre-built sample app rather than creating one from scratch. You'll clone the repository, install dependencies, and verify the app runs.

## 1.1: Clone the Workshop App

```bash
git clone https://github.com/efahsl/VegaWorkshopApp.git
cd VegaWorkshopApp
npm install
```

## 1.2: Verify Your Environment

Run `vega --version` and confirm the preview SDK (0.23.6188 or higher) is active.

## 1.3: Test the App

**Vega Studio:**

Click on the play icon next to the app project in the Vega side bar.

Note: You can start your app in "Debug" mode, which we generally recommend as this enables Fast Refresh and debugging breakpoints (but is slower), or "Release" mode which is faster and what you would use for submitting your app to the Appstore (but does not allow for fast refresh/breakpoints).

This will install and run the app on the Vega Virtual Device or FireTV Stick

<img src="../images/XHRc12aba94725f4761bd79bb1a7.png" height="400">

Once running, you should see the reference app on your device or virtual device:

<img src="../images/XHRa9e779280eb94f8192f4393d7.png" height="400">

<img src="../images/vega-navigation-working-animated.gif" width="640">

**Recommended Testing (Optional)**

_Fast Refresh (hot reload)_

Modify text in App.tsx to confirm fast refresh is working - this will make the rest of the workshop significantly easier and faster.

_Breakpoints_

Within the "App Performance Tools" of Vega Studio on the bottom-left, you can open "Chrome Dev Tools" add a breakpoint to line 38:

```
setImage(images.learn);
```

Now when you press the Learn button within the emulator, your editor should "break" and you should see the current variables/etc

<img src="../images/XHR0c9ca828e7c542de9aa3f3ba1.png" height="400">

> Throughout the workshop, you'll switch to different branches of this repo for each exercise. Each branch contains a specific scenario (performance bug, crash bug, or Shaka player upgrade) that you'll debug using the MCP server.

---

**Previous:** [Prerequisites](0_prerequisites.md) | **Next:** [Set Up MCP Server](2_set_up_mcp_server.md)
