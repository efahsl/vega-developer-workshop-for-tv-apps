# Phase 1: Create a Hello World App

## 1.1: Environment Setup

Verify your Vega CLI version

Run `kepler --version` command in a terminal window and confirm version is 0.21.4726 or higher.

Launch VS Code and verify the Vega Studio side bar appears in VS Code:

![Vega Studio Sidebar](../images/XHR9fdae9275ba24c52a7e35c0ee.png)

## 1.2: Create Your First Vega App (Hello World)

**Create Hello World App:**

In the VS Code Command Palette, run "Vega Project: Create a new Vega project" command and follow steps in the interactive wizard to create the project.

![Command Palette](../images/XHR126417328aa245b781134319b.png)

Use the "Hello World" template:

![Hello World Template](../images/XHR7cc1b0243c2545ad92ed89908.png)

VegaStudio asks for a directory to save the project, select one from your workspace.

Provide a name for your project:

![Project Name](../images/XHR0e03e66faa244202bcbc4f1e1.png)

![Package ID Prompt](../images/XHRbb34d49550c24c6d8fc13c848.png)

Add a package ID:

![Package ID](../images/XHR9f0674b1e1b847d0bfd520dae.png)

Open Your Created Project in VS Code (if it's not already open).

**Commit changes (Optional, but Recommended)**

Run `git init` in a terminal window in the App project directory and then `git commit` to commit the initial code.

## 1.3: Test Hello World App

**Vega Studio:**

Click on the play icon next to the app project in the Vega side bar.

Note: You can start your app in "Debug" mode, which we generally recommend as this enables Fast Refresh and debugging breakpoints (but is slower), or "Release" mode which is faster and what you would use for submitting your app to the Appstore (but does not allow for fast refresh/breakpoints).

This will install and run the app on the Vega Virtual Device or FireTV Stick.

![Play Icon](../images/XHRc12aba94725f4761bd79bb1a7.png)

![Running App](../images/XHR3a0610450b974a119a77f3f38.png)

**Recommended Testing (Optional)**

**Fast Refresh (hot reload)**

Modify text in App.tsx to confirm fast refresh is working - this will make the rest of the steps of creating your Vega app significantly easier and faster.

**Breakpoints** - you can open Chrome Dev Tools within Vega Studio and add a breakpoint to line 38:
```javascript
setImage(images.learn);
```

When you press the Learn button, your editor should "break" and you should see the current variables/etc.

![Breakpoint](../images/XHR81ca84c05fda42c98d2ca42b6.png)

![Debug View](../images/XHR0c9ca828e7c542de9aa3f3ba1.png)

---

[← Previous: Prerequisites](0_prerequisites.md) | [Next: Set Up MCP Server →](2_set_up_mcp_server.md)
