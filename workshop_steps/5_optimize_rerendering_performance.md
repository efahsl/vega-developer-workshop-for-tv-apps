# Phase 5: Optimize App Performance

TV apps require smooth 60fps performance for a good user experience. In this phase, we'll identify and fix common React Native performance issues—specifically unnecessary re-renders that cause lag during D-pad navigation.

## 5.1: Create a Performance Problem

Before optimizing, let's add a feature that can further expose performance issues. We'll add a dynamic background image that changes based on the focused item.

**Prompt your agent:**

```
Update HomeScreen.tsx to add a full-screen background image that matches the currently focused thumbnail. Use images.poster_16x9 from the data. Add a semi-transparent dark overlay so the content remains visible. Keep the implementation simple—no memoization yet.
```

**Expected result:**
- A state variable tracks the focused item
- Background Image displays the poster
- Dark overlay ensures text readability
- Focus handlers update the background

```typescript
const [backgroundImage, setBackgroundImage] = useState<string>('');

const handleItemFocus = (item: MovieItem) => {
  setBackgroundImage(item.images.poster_16x9);
};

return (
  <View style={styles.container}>
    {backgroundImage && (
      <>
        <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
        <View style={styles.overlay} />
      </>
    )}
    {/* Content rows */}
  </View>
);
```

<img src="../images/app-background-image-on-grid.gif">

### Test the Performance Impact

Navigate through your content rows with the D-pad. You'll likely notice:
- Lag or stuttering during quick navigation
- The app feels less responsive

This happens because every focus change triggers a state update, causing the entire HomeScreen and all its children to re-render—even components whose data hasn't changed.

---

## 5.2: Detect Unnecessary Re-renders

Now let's identify exactly which components are re-rendering and why. We'll use **Why Did You Render (WDYR)**, a tool that logs unnecessary re-renders to the console.

### Option A: Manual Setup

**Prompt your agent:**

```
Help me set up Why Did You Render to detect unnecessary re-renders in HomeScreen.tsx. Walk me through the setup and help me analyze the output.
Don't rebuild the app or any other further steps, I'll do that myself. 
```
_(Note that the current prompt in the MCP server may try to automatically build/run the app - we are not doing that in this manual mode, which is why we used that last sentence in the prompt above.)_


The agent will:
1. Install `@welldone-software/why-did-you-render` as a dev dependency
2. Configure `babel.config.js` and create `wdyr.tsx`
3. Import it at the top of `index.js`


You will need to rebuild and re-run the app. Once running navigate through your list a few times and watch your Metro console logs (they may be quite large). WDYR will show messages like:

```
ContentRow Re-rendered because the props object itself changed 
but its values are all equal.
```

This tells you the component re-rendered unnecessarily—the data was identical, but React saw different object references.

You will need to _manually_ analyze the WDYR output back to your agent to find the exact components and props causing issues. Prompt:
```
this is my console output...
{PASTE LOG SNIPPET}
```
(beware context overflow, you likely will NOT be able to paste the entire log)

### Option B: Automated Workflow

If your tool supports it, use the pre-built prompt:

```
@detect_component_re-renders HomeScreen.tsx
```

This runs through the setup, testing, and analysis automatically. But you will still need to manually navigate through your list to trigger the behaviors. Follow the prompts for specific instructions.

---

## 5.3: Understanding the Fixes

> **Already familiar with React.memo, useCallback, and useMemo?** Skip to [5.4: Additional Tools](#54-additional-optimization-tools) or [5.5: FlatList Optimization](#55-optimize-flatlist-performance).

For this app, WDYR typically identifies these types of issues:

1. **Components re-render when props haven't changed** — need `React.memo`
2. **Functions are recreated every render** — need `useCallback`
3. **Arrays/objects are recreated every render** — need `useMemo`

Let's talk through how each issue is fixed:

### Fix 1: Wrap Components with React.memo

**Problem:** By default, React re-renders a component whenever its parent re-renders—regardless of whether the component's props actually changed. This is React's "safe" behavior: it assumes the child might need to update, so it re-renders just in case.

In our app, when you focus a new thumbnail, `HomeScreen` updates its `backgroundImage` state. This causes `HomeScreen` to re-render, which triggers re-renders of every `ContentRow`, which triggers re-renders of every `ThumbnailItem`—even though none of their data changed. With 5 rows of 10+ items each, that's 50+ unnecessary re-renders per focus change.

**Before:**
```typescript
const ThumbnailItem = ({item, onPress, onFocus}: ThumbnailItemProps) => {
  return (
    <Pressable onPress={onPress} onFocus={onFocus}>
      <Image source={{uri: item.images.thumbnail_450x253}} />
    </Pressable>
  );
};
```

**After:**
```typescript
const ThumbnailItem = React.memo(({item, onPress, onFocus}: ThumbnailItemProps) => {
  return (
    <Pressable onPress={onPress} onFocus={onFocus}>
      <Image source={{uri: item.images.thumbnail_450x253}} />
    </Pressable>
  );
});
```

**Why it works:** `React.memo` wraps your component and adds a check before re-rendering: "Are the new props the same as the old props?" If yes, it skips the re-render entirely. This changes React's behavior from "always re-render children" to "only re-render if props changed."

The catch: `React.memo` uses shallow comparison (`===`), which checks if props are the *same reference*, not the same *value*. This matters for the next two fixes.

---

### Fix 2: Stabilize Functions with useCallback

**Problem:** In JavaScript, every time you define a function, you create a new object in memory—even if the function does the exact same thing. When you define a function inside a component, a *new* function is created on every render.

```typescript
const handleItemPress = (item) => { ... };  // New function object every render
```

Even though the function's code is identical, `handleItemPress` from render #1 is a different object than `handleItemPress` from render #2. When `React.memo` compares `onItemPress={handleItemPress}`, it sees different references and thinks the prop changed—so it re-renders anyway.

This defeats the purpose of `React.memo`. You wrapped your component to skip unnecessary re-renders, but it's still re-rendering because the function props are "new" every time.

**Before:**
```typescript
const HomeScreen = ({navigation}) => {
  // ❌ New function created every render
  const handleItemPress = (item: MovieItem) => {
    navigation.navigate('Detail', {...});
  };

  return <ContentRow onItemPress={handleItemPress} />;  // Different reference each time!
};
```

**After:**
```typescript
const HomeScreen = ({navigation}) => {
  // ✅ Same function reference unless dependencies change
  const handleItemPress = useCallback((item: MovieItem) => {
    navigation.navigate('Detail', {...});
  }, [navigation]);

  return <ContentRow onItemPress={handleItemPress} />;  // Same reference!
};
```

**Why it works:** `useCallback` caches the function and returns the *same* reference on subsequent renders. It only creates a new function when the dependencies (in the array) change. Now `React.memo` sees the same `onItemPress` reference and correctly skips re-rendering.

---

### Fix 3: Cache Computed Data with useMemo

**Problem:** The same reference issue applies to arrays and objects. When you compute a value like `movies.filter(...)`, you create a new array every time—even if the result contains the exact same items.

```typescript
const trendingMovies = movies.filter(m => m.trending);  // New array every render
```

Even if `movies` hasn't changed and the filtered result is identical, `trendingMovies` is a brand new array object. When passed as a prop, `React.memo` sees a different reference and re-renders.

This is especially wasteful for expensive computations. If you're filtering, sorting, or transforming a large dataset, you're doing that work on every render—even when the source data hasn't changed.

**Before:**
```typescript
const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  
  // ❌ New array created every render
  const trendingMovies = movies.filter(m => m.trending);
  
  return <ContentRow items={trendingMovies} />;  // Different reference each time!
};
```

**After:**
```typescript
const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  
  // ✅ Same array reference unless movies changes
  const trendingMovies = useMemo(
    () => movies.filter(m => m.trending),
    [movies]
  );
  
  return <ContentRow items={trendingMovies} />;  // Same reference!
};
```

**Why it works:** `useMemo` caches the computed result and returns the *same* reference on subsequent renders. It only recalculates when the dependencies change. This both avoids redundant computation and ensures `React.memo` sees stable prop references.

---

### How They Work Together

All three optimizations must be used together:

```
Without optimization:
Focus change → HomeScreen renders → ContentRow renders → ThumbnailItem renders (×50)

With optimization:
Focus change → HomeScreen renders → ContentRow skips → ThumbnailItem skips
```

1. Parent re-renders (background image state changed)
2. `useMemo` returns the same array references
3. `useCallback` returns the same function references
4. `React.memo` sees identical props → skips re-render ✅

**Important:** 
- `React.memo` alone won't help if props are recreated every render
- `useMemo`/`useCallback` alone won't help if components aren't wrapped in `React.memo`

---

### Measured Performance Impact

When making these fixes and running traces, we see dramatic improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Process CPU (avg) | 56% | 13.5% | **75.9% reduction** |
| Peak CPU | 120% | 60% | 50% reduction |
| System CPU (avg) | 175% | 136% | 22% reduction |
| Memory (avg) | 157 MB | 163 MB | +4.3% (expected) |

**Component renders per focus change:**
- Before: ~150+ renders (HomeScreen + 5 ContentRows + ~50 ThumbnailItems each)
- After: 1 render (just HomeScreen)

The 75.9% CPU reduction proves the app was wasting most of its processing power on redundant renders - and remember this is a very simple app! The slight memory increase (~6 MB) is the cost of caching—a worthwhile trade-off.

---

## 5.4: Additional Optimization Tools

### React DevTools Profiler

While WDYR detects *unnecessary* re-renders, the React DevTools Profiler shows the *time cost* of each render.

**Setup:**
1. Install React DevTools: https://react.dev/learn/react-developer-tools
2. Open DevTools → Profiler tab
3. Record while navigating with D-pad
4. Review the flame graph

**Look for:**
- Yellow/red components (slow renders)
- Components rendering too frequently
- Render cascades from parent to children

**Note:** For Vega apps on Fire TV, use remote debugging. 

### ESLint Plugin for React Compiler

React 19's compiler will automatically add memoization. While Vega currently uses React 18 (RN 0.72), you can prepare your code now.

**Prompt:**
```
Enable eslint-plugin-react-compiler on this project and run the linting rules.
```

**Or manually:**
```bash
npm install --save-dev eslint-plugin-react-compiler
```

```json
// .eslintrc
{
  "plugins": ["react-compiler"],
  "rules": {
    "react-compiler/react-compiler": "error"
  }
}
```

The plugin catches patterns that prevent automatic optimization: mutating state directly, side effects in render, conditional hooks, etc.

**Current recommendation:** Continue using manual memoization. The plugin helps write future-proof code.

---

## 5.5: Optimize FlatList Performance

FlatList itself can be a bottleneck. You have two options:

### Option A: Tune FlatList Props

**Prompt:**
```
Optimize the FlatList components in HomeScreen for TV performance. Add windowSize, maxToRenderPerBatch, initialNumToRender, removeClippedSubviews, and getItemLayout.
```

**Expected result:**
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  horizontal
  windowSize={5}
  maxToRenderPerBatch={5}
  initialNumToRender={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  })}
/>
```

### Option B: Replace with Vega Carousel

The Vega Carousel is a native component optimized for TV navigation.

**Prompt:**
```
Replace the FlatList rows in HomeScreen.tsx with the Vega Carousel from @amazon-devices/kepler-ui-components. Keep the same images and dimensions. Use FocusIndicator="fixed".
```

The Carousel provides smoother scrolling and better performance, especially on-device.

**Before (FlatList):**

<img src="../images/vega-flatlist-animated.gif">

**After (Carousel):**

<img src="../images/vega-carousel-animated.gif">

---

## Summary

In this phase, you learned to:
1. **Identify** performance issues using Why Did You Render
2. **Fix** unnecessary re-renders with `React.memo`, `useCallback`, and `useMemo`
3. **Measure** improvements (75% CPU reduction in our tests)
4. **Optimize** FlatList or replace with native Carousel

These patterns are essential for TV apps where D-pad navigation triggers frequent state updates.

---

**Previous:** [Performance Testing](4_performance_testing.md) | **Next:** [Accessibility](6_accessibility.md)
