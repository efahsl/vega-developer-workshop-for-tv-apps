# Phase 4: Performance Testing & Analysis

In this phase, we'll establish a performance baseline for your app using Vega's KPI visualization tools. This baseline will help us measure the impact of optimizations in the next phase.

> **Important — Prerequisites for UI Fluidity Testing:**
>
> The UI fluidity KPI test requires **Appium** with the Vega Kepler driver. If you haven't set up Appium yet, follow the installation guide here before proceeding: [Appium Setup for Vega](https://developer.amazon.com/docs/vega/latest/appium-setup.html)
>
> For the best and most accurate results, you should:
> 1. **Use a physical Vega Fire TV device** (with [developer mode](https://developer.amazon.com/docs/vega/0.21/developer-mode.html) enabled) — virtual devices may not support the kpi-visualizer tracing tools and can produce unreliable or missing metrics.
> 2. **Build and install a "Release" build** of your app (not "Debug") — debug builds include extra overhead from Fast Refresh and developer tooling that will skew your performance numbers.

## 4.1: Run Baseline UI Fluidity Test

We can use prompts to run a baseline UI fluidity test for our app.

**Prompt:**
```
Rebuild and re-run the app in release mode. Use the Vega CLI tool to run the ui-fluidity test from the Vega kpi-visualizer tool. Save the results to a file (ui-fluidity-baseline.md), because in the future, we are going to make changes and run another test for comparison.
```

You should get a result that looks something similar to the following:
```
Performance analyzer Performance KPIs Report

Firmware version: vvrp-tv-arm64-user OS 1.1 (TV Ship day60/10503430), serial number: bfb50198152XXXXX
Date: 02/11/2026, test: scrolling, iterations requested: 3, iterations completed: 3, duration: 30 seconds


                                 Fluidity                                 |     n     |       min       |       mean      |       max       |      stdev      |     ci (+/-)   
3+ Consecutive Dropped Frames, frame                                      |         3 |              28 |              28 |              28 |             0.0 |             0.0
5+ Consecutive Delayed Events - Focus, event                              |         3 |               0 |               0 |               0 |             0.0 |             0.0
5+ Consecutive Dropped Frames, frame                                      |         3 |              28 |              28 |              28 |             0.0 |             0.0
App Event Response Time - Focus, ms                                       |        84 |             0.2 |             2.7 |            33.8 |             4.9 |             0.9 √ 
Fluidity %, %                                                             |         3 |            97.4 |            97.6 |            97.8 |             0.2 |             0.3
Granular Fluidity %, %                                                    |       128 |             0.0 |            83.2 |           100.0 |            20.0 |             2.9 √ 


The √ signifies statistically sound data for a KPI. If missing,consider running more test iterations and consult CI (+/-) column for confidence interval.
You can also run perf doctor command to check the stability of the target device.

KPI Value Analysis Results: output/2026-02-11_14-26-14/scrolling-kpi-validator-results2026-02-11_14-26-14.json
KPI Report File:output/2026-02-11_14-26-14/scrolling-kpi-report-2026-02-11_14-26-14.json
Output Folder: output/2026-02-11_14-26-14
Data successfully appended to file
Data successfully appended to file
Shutting down telemetry client.

```

**🏁 Checkpoint:** Your agent should save these results to a .md file. Look for metrics like "Fluidity %" and "App Event Response Time" — we'll compare against these after making optimizations. 

---

**Previous:** [Create a 3 Screen App](3_create_3_screen_app.md) | **Next:** [Optimize Re-rendering Performance](5_optimize_rerendering_performance.md)
