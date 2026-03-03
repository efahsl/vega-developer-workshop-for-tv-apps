---
inclusion: manual
---

# SEA Workshop Structure

Source: https://quip-amazon.com/FkspA0azpYd2/Agenda-and-logistics-for-Vega-Developer-Days-2026

## Overview

Hands-on MCP workshop (90 min, 10:30am–12:00pm) at Vega Developer Days 2026 (March 5, SEA 33 Blackfoot). Developers use `@amazon-devices/amazon-devices-buildertools-mcp` to debug and upgrade pre-built Vega TV apps. Developers do NOT create new apps — they check out pre-defined code samples and follow guided exercises.

Target audience: 3P partners (Paramount, Pluto, CBS, AMC, NFL).

## Repositories

- **Workshop steps repo** (this repo): https://github.com/efahsl/vega-developer-workshop-for-tv-apps — contains the step-by-step instructions developers follow. Local clone is the current working directory; will sync to GitHub once steps are final.
- **Sample app repo**: https://github.com/efahsl/VegaWorkshopApp — contains the code developers check out. Each exercise lives on its own branch; developers switch branches to run each exercise.

## Prerequisites

1. macOS 10.15+ or Ubuntu 20.4+ (M-series Macs recommended).
2. Configure `.npmrc` for the private Vega SDK registry:
   ```
   @amazon-devices:registry=https://k-artifactory-external.labcollab.net/artifactory/api/npm/rnpreview-npm-prod-local/
   always-auth=true
   strict-ssl=true
   ```
3. Install the Vega SDK via standard npm install after configuring `.npmrc`.
4. An AI coding assistant (Kiro, Cursor, Claude Code, or Copilot). 2000 free Kiro credits available.
5. A Vega Fire TV Stick with [Developer Mode](https://developer.amazon.com/docs/vega/0.22/developer-mode.html) enabled (and optionally an HDMI capture card).
6. Clone the sample app repo and verify it runs on VVD.

## MCP Workshop Agenda (90 min)

1. **Intro & Setup** (Hrishi Dok, 10 min) — What to expect, verify setup, checkout sample package, run on VVD.
2. **Performance Debugging via MCP** (Snehal Chavan, 15 min) — Checkout the `perf_demo` branch, run the UI fluidity case using the fluidity prompt.
3. **Crash Debugging via MCP** (Ryan Yoon, 15 min) — Checkout the `crash_demo` branch, run the crash debugging prompt.
4. **Shaka Player Upgrade via MCP** (Josh Kim, 15 min) — Checkout the shaka-upgrade branch, run the upgrade exercise.

## Key Points for Workshop Steps

- Developers check out branches with pre-built code from the sample app repo, not create apps from scratch.
- The MCP server (`@amazon-devices/amazon-devices-buildertools-mcp`) is the central tool for all exercises.
- Three core outcomes: debug a performance issue, debug a crash, run a Shaka player upgrade.
