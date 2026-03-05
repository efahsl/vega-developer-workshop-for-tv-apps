# Diagnose and Fix UI Fluidity Issues

TV apps require smooth 60fps rendering for a good user experience. In this exercise, you'll use your AI agent to check out a branch with an intentional performance bug, build and run the app on your Fire TV device, then diagnose and fix UI fluidity issues — all through chat prompts.

## Prompts at a Glance

This exercise requires **3 prompts** to your AI agent. Here's the full sequence:

| # | Type | What You Do |
|---|------|-------------|
| 🤖 Prompt 1 | AI Agent | `Checkout the perf-demo branch, clean previous builds (build and node_modules directories) and build the Debug variant via npm. Then install and launch the vega app on my Fire TV device using vega sdk` |
| 🤖 Prompt 2 | AI Agent | `How is my app's UI fluidity performance? Can you check and make improvements using vega workflow?` |
| 🤖 Prompt 3 | AI Agent | `Yes. Proceed with rebuilding, reinstalling the app, and remeasuring UI fluidity` |

## Prerequisites

Before starting this exercise, make sure you have:

- [ ] Completed [Clone and Run Reference App](1_clone_and_run_reference_app.md)
- [ ] Completed [Set Up MCP Server](2_set_up_mcp_server.md) and verified the MCP server is connected
- [ ] A physical Fire TV device connected via ADB (Fire TV Stick, Fire TV Cube, etc.)
---

## Step 1: Check Out the Branch

### 🤖 Prompt 1

Copy and paste this into your AI agent's chat:

```
Checkout the perf-demo branch, clean previous builds (build and node_modules directories) and build the Debug variant via npm. Then install and launch the vega app on my Fire TV device using vega sdk
```

The agent will:
1. Switch to the `perf-demo` branch (`git checkout perf-demo`)
2. Clean any previous build artifacts (`rm -rf build node_modules`)
3. Install npm dependencies (`npm install`)
4. Build the app in Debug mode (`npm run build:debug`)
5. Deploy and launch the app on your connected Fire TV device (`vega device install-app --dir . -b Debug` followed by `vega device launch-app --dir .`)

**🏁 Checkpoint:** You should be on the `perf-demo` branch with a clean build directory. The app should launch and you can navigate with the D-pad. You may notice some lag while scrolling — that's the bug we're about to diagnose.

---

## Step 2: Diagnose and Fix UI Fluidity

### 🤖 Prompt 2

Copy and paste this into your AI agent's chat:

```
How is my app's UI fluidity performance? Can you check and make improvements using vega workflow?
```

The agent will follow the workflow from the MCP server. It will:

1. Read the workflow document `react_native_for_vega_diagnose_ui_fluidity`
2. Analyze results, identify the time period where the biggest fluidity drop occured
3. Identify hot functions in the above time period using `get_app_hot_functions`
4. Apply code optimizations

The agent will ask you several questions during setup. Here are the recommended answers:

| Agent Question | Recommended Answer | Why |
|---------------|-------------------|-----|
| "Using app process name from manifest: `com.amazondeveloper.rnlconfapp`. Is this correct?" | **Yes** | Auto-detected from `manifest.toml` |
| "Which build type should be used for analysis?" | **Debug** | Debug builds include sourcemaps needed for hot function analysis |
| "Custom test scenario or default scrolling test?" | **Custom** — use `fluidity_test_scenario/send_d_pad_key_sample_test.py` | This test script sends D-pad key events that reliably trigger the fluidity bug |

**🏁 Checkpoint:** The agent should report UI Fluidity KPI as FAILING and apply optimizations to `HomeScreen.tsx`.

---

## Step 3: Verify Improvements

After the agent applies optimizations, it will ask if you'd like to rebuild and re-measure.

### 🤖 Prompt 3

Copy and paste this into your AI agent's chat:

```
Yes. Proceed with rebuilding, reinstalling the app, and remeasuring UI fluidity
```

The agent will:
1. Rebuild the app in Debug mode
2. Reinstall on your device
3. Re-run the KPI Visualizer to measure the new fluidity score

**🏁 Checkpoint:** The fluidity score should improve significantly from the baseline toward the ≥99% target. Here's a representative before vs. after comparison:

![UI Fluidity Before vs. After](../images/fluidity-before-after.png)

---

## Summary

In this exercise, you learned to:
1. Use the `diagnose_ui_fluidity` workflow to systematically identify UI fluidity failures
2. Let the AI agent analyze CPU hot functions and apply targeted optimizations
3. Verify improvements by re-running KPI measurements

---

## Coming Soon

1. AI-powered workflow to diagnose key press latency
2. AI-powered GPU optimization to improve UI fluidity

---

<details>
<summary>Appendix A: MCP Tools Used in Fluidity Diagnosis</summary>


This exercise uses three key tools from the Amazon Devices Builder Tools MCP server:

| Tool | What It Does | When It's Used |
|------|-------------|----------------|
| `analyze_perfetto_traces` | Analyzes Perfetto trace files to extract KPI metrics and pinpoint the worst-performing time windows during UI interactions. | To find the exact time period with the worst frame drops |
| `get_app_hot_functions` | Reads CPU trace data from the Activity Monitor and ranks the most CPU-intensive functions in your app code. Supports time-window filtering so you can focus on the problematic interval. | To identify which functions are burning the most CPU during fluidity dips |
| `why-did-you-render` (WDYR) | A React debugging library that logs unnecessary component re-renders to the Metro console. Detects when components re-render even though their props/state haven't meaningfully changed. | Optional deeper analysis to catch re-render issues that hot function analysis alone may not surface |

The first two are MCP server tools invoked by the agent automatically. WDYR is an npm package that gets installed into your project and produces logs during app interaction.

</details>

---

<details>
<summary>Appendix B: About the Bug</summary>


The `perf-demo` branch introduces render pipeline overload that causes real frame drops in `HomeScreen.tsx`:

- `FlatList` has been replaced with the native `Carousel` component (from `@amazon-devices/kepler-ui-components`), which continuously submits frames to the render pipeline — giving the fluidity metric something to measure even when JS is busy.
- Each `ThumbnailItem` renders 12 shadow layer `View` elements (`SHADOW_LAYERS = 12`), each with `shadowColor`, `shadowRadius`, `shadowOpacity`, and `elevation`, plus a nested inner shadow `View` — totaling 24 shadow-rendering operations per thumbnail.
- Three semi-transparent overlay `View`s are stacked on each thumbnail, forcing alpha blending on every frame.
- `React.memo` has been removed, inline style objects and `JSON.parse(JSON.stringify())` deep clones are added, and `renderItem`/`itemInfo` are recreated on every render.

Here's what the key problematic code looks like:

```tsx
const SHADOW_LAYERS = 12;

const ThumbnailItem = ({item, onPress}: ThumbnailItemProps) => {
  // 12 shadow layer configs created on every render
  const shadowLayers = Array(SHADOW_LAYERS)
    .fill(null)
    .map((_, i) => ({
      id: `shadow-${i}`,
      offset: i * 2,
      radius: 6 + i * 3,
      opacity: 0.12 + i * 0.025,
    }));

  return (
    <Pressable onPress={onPress}>
      {/* 12 shadow Views + 12 inner shadow Views = 24 shadow ops per thumbnail */}
      {shadowLayers.map((layer) => (
        <View key={layer.id} style={[styles.shadowBox, {
          top: layer.offset, left: layer.offset,
          shadowRadius: layer.radius, shadowOpacity: layer.opacity,
        }]}>
          <View style={styles.innerShadow} />
        </View>
      ))}
      <Image source={{uri: item.images.thumbnail_450x253}} style={styles.thumbnailImage} />
      {/* 3 overlay Views forcing alpha blending every frame */}
      <View style={styles.overlay1} />
      <View style={styles.overlay2} />
      <View style={styles.overlay3} />
    </Pressable>
  );
};
```

```tsx
const ContentRow = ({title, items, onItemPress}: ContentRowProps) => {
  // Deep clone on every render — unnecessary CPU pressure
  const renderItem = ({item}: {item: MovieItem}) => {
    const clonedItem = JSON.parse(JSON.stringify(item));
    return <ThumbnailItem item={clonedItem} onPress={() => onItemPress(item)} />;
  };

  // Recreated on every render
  const itemInfo: ItemInfo[] = [{ view: ThumbnailItem, dimension: { width: 415, height: 235 } }];
  const rowStyle = {marginBottom: 40};

  return (
    <View style={rowStyle}>
      <Text style={titleStyle}>{title}</Text>
      <Carousel data={items} itemDimensions={itemInfo} renderItem={renderItem} />
    </View>
  );
};
```

This overwhelms the CPU with excessive view hierarchy construction, style recalculation, and object allocation on every render cycle, causing frames to miss their vsync window and producing measurable fluidity degradation (typically ~79% vs. the ≥99% target).

</details>

---

<details>
<summary>Appendix C: Expected Optimizations</summary>


The agent typically applies these optimizations based on hot function analysis:

1. Reduce shadow layers from 12 to a lightweight count and pre-compute them as a module-level constant
2. Remove the 3 semi-transparent overlay `View`s (nearly invisible at 3% opacity)
3. Eliminate the `JSON.parse(JSON.stringify(item))` deep clone in `renderItem`
4. Wrap `ThumbnailItem` and `ContentRow` with `React.memo()`
5. Add `useCallback` for event handlers and `useMemo` for data grouping
6. Hoist static values (`itemInfo`, `rowStyle`, `titleStyle`) outside the render function

</details>

---

<details>
<summary>Appendix D: Generated Artifacts</summary>


After the KPI Visualizer completes, it produces several files in `generated/<timestamp>/` that the agent uses:

```
generated/<timestamp>/
├── scrolling-kpi-report-<timestamp>.json    ← KPI report (fluidity %, granular dips, response times)
├── iter_1_vs_trace                          ← Perfetto trace (used by analyze_perfetto_traces)
├── iter_1_trace<id>-converted.json          ← JS CPU profiler trace (used by get_app_hot_functions)
├── iter_2_vs_trace
├── iter_2_trace<id>-converted.json
└── ...                                      ← One pair per iteration
```

| File | Format | Used By | Purpose |
|------|--------|---------|---------|
| `scrolling-kpi-report-*.json` | JSON | Agent (direct read) | Contains overall Fluidity %, Granular Fluidity % time-series, and response times per iteration |
| `iter_*_vs_trace` | Perfetto binary | `analyze_perfetto_traces` | System-level trace with frame submission/vsync data — used to find worst time windows |
| `iter_*_trace*-converted.json` | Chrome Trace Event JSON | `get_app_hot_functions` | JS CPU profiler data with function names, durations, and source locations |

</details>
