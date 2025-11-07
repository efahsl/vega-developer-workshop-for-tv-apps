# Phase 1: Create a Hello World App

First we are going to create a Hello World app from our template for which we can build upon.

## 1.1: Environment Setup

Verify your Vega CLI version

Run `kepler --version` command in a terminal window and confirm version is 0.21.4726 or higher

Launch VS Code and verify the Vega Studio side bar appears in VS Code

<img src="../images/XHR9fdae9275ba24c52a7e35c0ee.png" height="400">

## 1.2: Create Your First Vega App (Hello World)

**Create Hello World App:**

In the VS Code Command Pallet, run "Vega Project: Create a new Vega project" command and follow steps in the interactive wizard to create the project

Use the "Hello World" template.

<img src="../images/XHR7cc1b0243c2545ad92ed89908.png" height="400">

VegaStudio asks for a directory to save the project, select one from your workspace

Provide a name for your project:

<img src="../images/XHR0e03e66faa244202bcbc4f1e1.png" width="640">

Add a package ID:

<img src="../images/XHR9f0674b1e1b847d0bfd520dae.png" width="640">

Open Your Created Project in VS Code (if it's not already open)

**Commit changes (Optional, but Recommended)**

Run `git init` in a terminal window in the App project directory and then `git commit` to commit the initial code.

## 1.3: Test Hello World App

**Vega Studio:**

Click on the play icon next to the app project in the Vega side bar.

Note: You can start your app in "Debug" mode, which we generally recommend as this enables Fast Refresh and debugging breakpoints (but is slower), or "Release" mode which is faster and what you would use for submitting your app to the Appstore (but does not allow for fast refresh/breakpoints).

This will install and run the app on the Vega Virtual Device or FireTV Stick

<img src="../images/XHR3a0610450b974a119a77f3f38.png" height="400">

**Recommended Testing (Optional)**

Fast Refresh (hot reload)

Modify text in App.tsx to confirm fast refresh is working - this will make the rest of the steps of creating your Vega app significantly easier and faster

Breakpoints - you can open Chrome Dev Tools within Vega Studio and add a breakpoint to line 38:
```
setImage(images.learn);
```

when you press the Learn button, your editor should "break" and you should see the current variables/etc

<img src="../images/XHR0c9ca828e7c542de9aa3f3ba1.png" height="400">

---

[← Previous: Prerequisites](0_prerequisites.md) | [Next: Set Up MCP Server →](2_set_up_mcp_server.md)
