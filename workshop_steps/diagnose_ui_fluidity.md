# Diagnose and Fix UI Fluidity Issues 

TV apps require smooth 60fps rendering for a good user experience. In this guide, we'll use the Amazon Devices BuilderTools MCP server to diagnose and fix UI fluidity issues.

## Prerequisites

Before starting this workshop, make sure you have the following ready:

- [ ] Open your IDE in the sample app root directory
- [ ] Follow [Install Vega Developer Tools](https://developer.amazon.com/docs/vega/latest/install-vega-developer-tools.html) to install required Vega tools
- [ ] [Install Appium 2.2.2 and the Kepler Appium driver](https://developer.amazon.com/docs/vega/0.22/appium-install.html) (required for KPI Visualizer)
- [ ] Install the Amazon Devices BuilderTools MCP server and initialize steering context
- [ ] Verify the MCP server is connected by asking the agent: "What is Vega Architecture?"
  - The agent should read `react_native_for_vega_get_started.md` and respond with details about split bundle architecture, process pre-warming, and component types

---

## About the Bug

Switch to the `perf-demo` branch, which already contains an intentional performance bug in `HomeScreen.tsx`:

```bash
git checkout perf-demo
```

After switching branches, build and install the app on your device:

```bash
rm -rf build node_modules
npm install
npm run build:debug
vega device install-app --dir . -b Debug
vega device launch-app --dir .
```

Verify the app launches and you can navigate with the D-pad before proceeding.

The bug introduces render pipeline overload that causes real frame drops:

- `FlatList` has been replaced with the native `Carousel` component (from `@amazon-devices/kepler-ui-components`), which continuously submits frames to the render pipeline — giving the fluidity metric something to measure even when JS is busy.
- Each `ThumbnailItem` renders 12 shadow layer `View` elements (`SHADOW_LAYERS = 12`), each with `shadowColor`, `shadowRadius`, `shadowOpacity`, and `elevation`, plus a nested inner shadow `View` — totaling 24 shadow-rendering operations per thumbnail.
- Three semi-transparent overlay `View`s are stacked on each thumbnail, forcing alpha blending on every frame.
- `React.memo` has been removed, inline style objects and `JSON.parse(JSON.stringify())` deep clones are added, and `renderItem`/`itemInfo` are recreated on every render.

Here's what the key problematic code looks like in `HomeScreen.tsx`:

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

---

## Tools Overview

This workshop uses three key tools from the Amazon Devices BuilderTools MCP server to diagnose and fix UI fluidity issues. Here's a quick summary before we dive in:

| Tool | What It Does | When It's Used |
|------|-------------|----------------|
| `analyze_perfetto_traces` | Analyzes Perfetto trace files to extract KPI metrics and pinpoint the worst-performing time windows during UI interactions. | Step 2 — to find the exact time period with the worst frame drops |
| `get_app_hot_functions` | Reads CPU trace data from the Activity Monitor and ranks the most CPU-intensive functions in your app code. Supports time-window filtering so you can focus on the problematic interval. | Step 2 — to identify which functions are burning the most CPU during fluidity dips |
| `why-did-you-render` (WDYR) | A React debugging library that logs unnecessary component re-renders to the Metro console. Detects when components re-render even though their props/state haven't meaningfully changed. | Step 5 (optional) — to catch re-render issues that hot function analysis alone may not surface |

The first two are MCP server tools invoked by the agent automatically. WDYR is an npm package that gets installed into your project and produces logs during app interaction.

---

## Step 1: Measure Baseline UI Fluidity

First, build and install the buggy app, then measure the current UI fluidity KPI.

**Prompt:**

```
How is my app's UI fluidity performance? Can you check and make improvements using vega workflow?
```

The agent will follow the `diagnose_ui_fluidity` workflow from the MCP server. It will:

1. Read the `react_native_for_vega_diagnose_ui_fluidity.md` workflow document
2. Verify prerequisites (Appium 2.2.2, kepler driver)
3. Resolve the app process name from `manifest.toml`
4. Ask which build type to use and whether you have a custom test scenario

The agent will ask you several questions during setup. Here are the recommended answers for this workshop:

| Agent Question | Recommended Answer | Why |
|---------------|-------------------|-----|
| "Using app process name from manifest: `com.amazondeveloper.rnlconfapp`. Is this correct?" | **Yes** | The process name is auto-detected from `manifest.toml` |
| "Which build type should be used for analysis? (Debug or Release)" | **Debug** | Debug builds include sourcemaps needed for hot function analysis |
| "Custom test scenario or default scrolling test?" | **Custom** — use `fluidity_test_scenario/send_d_pad_key_sample_test.py` | This test script sends D-pad key events that reliably trigger the fluidity bug |

The agent will then run the KPI Visualizer:

```bash
vega exec perf kpi-visualizer \
  --kpi ui-fluidity \
  --record-cpu-profiling \
  --app-name com.amazondeveloper.rnlconfapp \
  --sourcemap-file-path <sourcemap_file_path> \
  --test-scenario reference/RnlConfApp-Final/fluidity_test_scenario/send_d_pad_key_sample_test.py
```

Wait for the test to complete. The KPI report will show fluidity around ~79% — well below the 99% target.

### Generated Artifacts

After the KPI Visualizer completes, it produces several files in `generated/<timestamp>/` that the agent uses in subsequent steps:

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

The agent reads the KPI report first to find the worst iteration and timestamp, then feeds the corresponding trace files to the MCP tools for deeper analysis.

**🏁 Checkpoint:** The agent should report UI Fluidity KPI as FAILING with values around 79%.

---

## Step 2: Hot Function Analysis

After identifying the KPI failure, the agent automatically proceeds to analyze CPU hot functions. This uses the `get_app_hot_functions` tool from the Amazon Devices BuilderTools MCP server.

### What the Agent Does

1. Finds the worst iteration from the KPI report (lowest fluidity %)
2. Locates the worst time window using Granular Fluidity % data
3. Calculates a ±1 second analysis window around the worst timestamp
4. Calls `get_app_hot_functions` with `useSelfTime: true` to isolate actual bottleneck functions

### Expected Hot Function Results

The tool should identify functions like:

| Rank | Function | Duration | % of Total | Location |
|------|----------|----------|------------|----------|
| 1 | `ThumbnailItem` (render) | ~51ms | ~2.55% | `HomeScreen.tsx:86` |
| 2 | `[anonymous]` (shadow `.map()` callback) | ~11ms | ~0.55% | `HomeScreen.tsx:69` |
| 3 | `ThumbnailItem` (shadowLayers array creation) | ~11ms | ~0.55% | `HomeScreen.tsx:68` |

The hot function results directly map to the shadow layer rendering loop — both the `Array(SHADOW_LAYERS).fill(null).map(...)` construction (line 68) and the `.map()` rendering callback (line 69) are flagged as hot spots.

**🏁 Checkpoint:** The agent should identify `ThumbnailItem` and the shadow layer rendering as the primary CPU bottlenecks.

---

## Step 3: Apply Optimizations

The agent will propose optimizations based on both the hot function analysis and its own code review. When asked, approve the changes.

### Optimizations Typically Applied

1. Remove the 12 shadow layer `View`s — replace with a single lightweight shadow style on the container
2. Remove the 3 semi-transparent overlay `View`s
3. Eliminate the `JSON.parse(JSON.stringify(item))` deep clone in `renderItem`
4. Wrap `ThumbnailItem` and `ContentRow` with `React.memo()`
5. Add `useCallback` for event handlers and `useMemo` for data grouping
6. Hoist static values (`itemInfo`, `rowStyle`, `titleStyle`) outside the render function

### Before → After

**ThumbnailItem: 24 shadow ops → single shadow style**

```tsx
// AFTER: Wrapped with React.memo, shadow layers replaced with one lightweight style
const ThumbnailItem = React.memo(({item, onPress}: ThumbnailItemProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      style={[styles.thumbnail, focused && styles.thumbnailFocused]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}>
      <View style={styles.thumbnailShadow}>
        <Image source={{uri: item.images.thumbnail_450x253}} style={styles.thumbnailImage} />
      </View>
    </Pressable>
  );
});
```

```tsx
// thumbnailShadow replaces 12 shadowBox + 3 overlay Views
thumbnailShadow: {
  width: 400, height: 225,
  shadowColor: '#000000',
  shadowOffset: {width: 4, height: 4},
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 6,
},
```

**ContentRow: deep clone removed, static values hoisted, memoized**

```tsx
// Static values hoisted outside render
const ITEM_INFO: ItemInfo[] = [
  { view: ThumbnailItem, dimension: { width: 415, height: 235 } },
];
const ROW_STYLE = {marginBottom: 40};
const TITLE_STYLE = {fontSize: 48, color: '#FFFFFF', fontWeight: 'bold' as const, marginBottom: 20, paddingLeft: 60};

const ContentRow = React.memo(({title, items, onItemPress}: ContentRowProps) => {
  // No more JSON.parse/stringify — item passed directly
  const renderItem = useCallback(({item}: {item: MovieItem}) => {
    return <ThumbnailItem item={item} onPress={() => onItemPress(item)} />;
  }, [onItemPress]);

  return (
    <View style={ROW_STYLE}>
      <Text style={TITLE_STYLE}>{title}</Text>
      <Carousel data={items} itemDimensions={ITEM_INFO} renderItem={renderItem} />
    </View>
  );
});
```

---

## Step 4: Verify Improvements

After the optimizations are applied, the agent will:

1. Rebuild the app: `npm run build:debug`
2. Reinstall: `vega device install-app --dir . -b Debug`
3. Re-run the KPI Visualizer to measure the new fluidity score

**Prompt (if the agent doesn't automatically re-measure):**

```
Rebuild the app and re-run the UI fluidity KPI test to verify improvements.
```

The fluidity score should improve significantly from the ~79% baseline toward the ≥99% target. If the score is still below 99%, proceed to Step 5 for deeper re-render analysis.

**🏁 Checkpoint:** The agent should report improved fluidity numbers after rebuilding and re-measuring.

---

## Step 5: (Optional) Detect Component Re-renders

If the KPI is still below 99% after hot function optimizations, or if you want deeper analysis, you can run the component re-render detection workflow. This uses the `detect_component_re-renders` prompt from the MCP server.

**Prompt:**

```
@detect_component_re-renders ./
```

### What Happens

The agent will:

1. Install `@welldone-software/why-did-you-render` as a dev dependency
2. Configure `babel.config.js` for Hermes compatibility (switches JSX runtime to `classic` in development)
3. Create a `wdyr.tsx` config file with `trackAllPureComponents: true` and `trackAllComponents: true`
4. Import it as the first line in `index.js`
5. Build and run the app with WDYR enabled, capturing Metro logs to a temp file
6. Ask you to interact with the app using the remote control — navigate, scroll, press buttons for 2-3 minutes
7. Ask you to type **STOP** when done
8. Analyze the captured logs

### Example WDYR Log Output

After interacting with the app, the Metro logs will contain entries like:

```
ContentRow Re-rendered because of props changes:
  props.renderItem: different functions with the same name

ThumbnailItem Re-rendered because of props changes:
  props.onPress: different functions with the same name
  props.item: different objects that are equal by value

SpatialNavigationVirtualizedList Re-rendered because of props changes:
  props.renderItem: different functions with the same name
  Rendered by Grid: Re-rendered because of hook changes
```

### What These Logs Tell You

| Log Pattern | Root Cause | Fix |
|-------------|-----------|-----|
| `different functions with the same name` | Function recreated on every render | Wrap with `useCallback` |
| `different objects that are equal by value` | Object/array recreated with same data | Wrap with `useMemo` or hoist outside render |
| `Re-rendered because of hook changes` | Hook dependency causing re-render | Check `useEffect`/`useState` dependencies |
| Component re-renders but WDYR is silent | Component is not wrapped in `React.memo` | Add `React.memo()` wrapper |

### Expected Impact

```
Without optimization:
Focus change → HomeScreen renders → ContentRow renders → ThumbnailItem renders (×50)

With optimization:
Focus change → HomeScreen renders → ContentRow skips → ThumbnailItem skips
```

After applying the recommended fixes (`React.memo`, `useCallback`, `useMemo`), component renders per focus change should drop from ~150+ to just 1 (HomeScreen only).

**🏁 Checkpoint:** After running WDYR analysis, the agent should identify specific components causing unnecessary re-renders and recommend targeted fixes.

---

## Summary

In this guide, you learned to:
1. Use the `diagnose_ui_fluidity` workflow to systematically identify UI fluidity failures
2. Analyze CPU hot functions with the `get_app_hot_functions` MCP tool to pinpoint rendering bottlenecks
3. Combine tool-driven analysis with code review to produce comprehensive fixes
4. Verify improvements by re-running KPI measurements

The hot function analysis approach is particularly effective for CPU-side issues like excessive view hierarchy construction, redundant object allocation, and unnecessary re-renders — problems that consume CPU cycles on the JS and UI threads during frame production.
