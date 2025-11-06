# Phase 4: Performance Testing & Analysis

In this phase, we are going to benchmark performance tests of the app we have built so far. But first we need to run the app on a physical FireTV stick to get a performance baseline (the Vega Virtual Device is NOT an accurate indicator of on-device performance - it will almost always be faster on the virtual device).

## 4.1: Run the App on FireTV Stick

Let's connect the FireTV Stick to the development machine and test our app on the device.

> If you have already setup and ran your app on a FireTV stick, you can skip this milestone

### Steps:

Plug in your Fire TV stick to both an HDMI screen and USB power - whether through your laptop or a power outlet (note that you will need to be plugged in via USB for later steps).

*If you do not have an extra TV/monitor/etc - you can consider using an HDMI capture card to view the contents of the Fire TV Stick on your laptop using Quicktime/OBS/etc.*

![Fire TV Stick](../images/XHR0f97c21856f547a897ea02973.png)

You will need to connect to wifi and complete login/registration steps on the FireTV stick using your FireTV Stick Remote, and then you should be able to see your Fire TV UI below (this is called the "Launcher App").

![Fire TV UI](../images/XHR0c17af328ed544a6bc91a31b2.png)

### Run Your App

Next, we will run the app we've built on the Fire TV device itself. Performance testing is best done on a 'release' build to get accurate performance baselines.

In the Vega Studio side bar, select the FireTV Stick device under "Devices" panel and "Release" under "Build Modes", then click the play icon next to the project to build and run the app on the device.

![Vega Studio Device Selection](../images/XHR50dbbb7c316c43109ebfcd6e3.png)

You should now see your app running on your TV device, and be able to navigate the screens via the remote control.

## 4.2: Performance Analysis

Next, we will run a performance test of the app on our physical device to get a performance baseline.

This is required to accurately measure performance, apply targeted performance optimizations and re-measure to verify performance improvements.

### Run Performance Test

Connect a FireTV stick device and run "App KPI Visualizer" tool from Vega Studio side bar in VS Code:

![App KPI Visualizer](../images/XHR7994f428b5be4518b97c52ce9.png)

Select following options in the wizard:

**KPIs: Choose - 'Cool Start Latency' and 'UI Fluidity' tests**

![KPI Selection](../images/XHRacbe3e86947840b5a662aaace.png)

Uncheck "Record CPU Profiler" - *this option records a CPU profiler trace to deep-dive further into performance issues*

![CPU Profiler Option](../images/XHR5ea09e4481a7473d9d2033a49.png)

Select "No" for the following:

Selecting "No" will run a default UI automation script. Otherwise you can create a new custom Appium based UI automation script and use that.

![Automation Script](../images/XHR5b7b6421529748e1bc4b3f38d.png)

Select defaults for all other options in the wizard.

Once KPI Visualizer starts, you should see a notification window as below:

![KPI Visualizer Running](../images/XHR3063643309f34a39a1a4f2ea8.png)

### Analyze Performance Report

The Performance report is automatically opened after performance test is completed.

Check which KPIs are failing.

## 4.3: AI-Assisted Diagnosis

### Diagnose Performance Issues

For failing KPIs, click "Diagnose with AI" action shown in the KPI report to diagnose a failing KPI:

![Diagnose with AI](../images/XHR786f1b1327704254acc105705.png)

Review & apply suggested optimizations.

Re-run performance test.

---

[← Previous: Create 3 Screen App](3_create_3_screen_app.md) | [Next: Performance Improvements →](5_performance_improvements.md)
