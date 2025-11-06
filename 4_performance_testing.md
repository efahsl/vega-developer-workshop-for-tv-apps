# Phase 4: Performance Testing & Analysis

Next, let's run the app on a physical FireTV stick to test the actual 10-foot experience and run some performance tests to get a performance baseline.

## 4.1: Run the App on FireTV Stick

In this milestone, let's connect the FireTV Stick to the development machine and test our app on the device

> If you have already setup and ran your app on a FireTV stick, you can skip this milestone

**Steps:**

1. Connect your FireTV stick to your development machine via the USB cable

2. If you have a HDMI Capture card, connect the HDMI port of the FireTV Stick to the capture card, then connect the capture card to your development machine

3. You should see the FireTV UI in Quicktime player on your Mac, under "New Movie Recording"

![Quicktime Setup](./images/XHR0f97c21856f547a897ea02973.png)

![FireTV UI](./images/XHR0c17af328ed544a6bc91a31b2.png)

4. Complete login and registration steps on the FireTV stick using your FireTV Stick Remote

5. Run your app

   a. In Vega Studio side bar, select the FireTV Stick device under "Devices" panel and "Release" under "Build Modes", then click the play icon next to the project to build and run the app on the device

![Run on Device](./images/XHR50dbbb7c316c43109ebfcd6e3.png)

## 4.2: Performance Analysis

In this milestone, we will run a performance test on the app on a physical device to get a performance baseline.

This is required to accurately measure performance, apply targeted performance optimizations and re-measure to verify performance improvements.

**Steps:**

1. **Run Performance Performance test:**

   a. Connect a FireTV stick device and run "App KPI Visualizer" tool from Vega Studio side bar in VS Code

![KPI Visualizer](./images/XHR7994f428b5be4518b97c52ce9.png)

   i. Select following options in the wizard:

   1. KPIs: Choose - 'Cool Start Latency' and 'UI Fluidity' tests

![Select KPIs](./images/XHRacbe3e86947840b5a662aaace.png)

   2. Uncheck "Record CPU Profiler" - *this option records a CPU profiler trace to deep-dive further into performance issues*

![CPU Profiler Option](./images/XHR5ea09e4481a7473d9d2033a49.png)

   3. Select "No" for the following:

![Additional Options](./images/XHR5b7b6421529748e1bc4b3f38d.png)

   4. Select defaults for all other options in the wizard

   5. Once KPI Visualizer starts, you should see a notification window as below

![KPI Running](./images/XHR3063643309f34a39a1a4f2ea8.png)

2. **Analyze performance report**

   a. Performance report is automatically opened after performance test is completed

   b. Check which KPIs are failing

## 4.3: AI-Assisted Diagnosis

1. **Diagnose performance issues**

   a. For failing KPIs, click "Diagnose with AI" action shown in the KPI report to diagnose a failing KPI

![Diagnose with AI](./images/XHR786f1b1327704254acc105705.png)

   b. Review & apply suggested optimizations

   c. Re-run performance test

---

[← Previous: Create 3 Screen App](3_create_3_screen_app.md) | [Next: Performance Improvements →](5_performance_improvements.md)
