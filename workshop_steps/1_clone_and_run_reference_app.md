# Phase 1: Clone and Run the Workshop App

We'll use a pre-built reference app rather than creating one from scratch.

In this exercise you'll clone the app repository, build the app, and verify the app runs.

## 1.1: Clone the Workshop App

In the terminal window run the following command:

```bash
# Navigate to the workshop directory
cd ~/vegaWorkshop

# Clone the workshop reference app repository
git clone https://github.com/efahsl/VegaWorkshopApp.git

# Navigate to the workshop reference app repository
cd VegaWorkshopApp
```

## 1.2: Install Vega Steering Document

In the terminal window of the project run the following command:

```bash
 npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context
```

Then choose your AI Agent from the list to install the MCP and Vega steering document.

## 1.3: Open the vegaWorkshop workspace in AI Agent

Open the `~/vegaWorkshop` workspace in your AI Agent.

For example, to open the workspace folder in Kiro IDE from terminal window, run the following command. Alternately, you can open it from Kiro IDE's file menu.

```bash
kiro ~/vegaWorkshop
```

## 1.4: Connect your Vega device

Connect your Fire TV 4K Select device to your computer, then run the following command in a terminal window to confirm it is connected:

```bash
 vega device list
```

## 1.5: Build and Run the App

Open your AI coding assistant (with the MCP server configured in the prerequisites) and run the following prompt:

```
Build the release variant of this app using npm and install it on the connected Vega device
```

Your AI assistant will use the MCP workflows to build the app and deploy it to your connected Vega device.

Once running, you should see the reference app on your device:

<img src="../images/XHRa9e779280eb94f8192f4393d7.png" height="400">

<img src="../images/vega-navigation-working-animated.gif" width="640">

Alternately, you can build & run your app by following the instructions included in https://developer.amazon.com/docs/vega/latest/run-apps.html

> Throughout the workshop, you'll switch to different branches of this repo for each exercise. Each branch contains a specific scenario (performance bug, crash bug, or Shaka player upgrade) that you'll debug using the MCP server.

---

**Previous:** [Prerequisites](0_prerequisites.md) | **Next:** [Performance Debugging](2_diagnose_ui_fluidity.md)
