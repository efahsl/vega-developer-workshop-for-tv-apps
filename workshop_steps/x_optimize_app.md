# Phase X: Optimize App Performance

Now that we have a working app, let's identify and fix performance issues related to re-rendering and list optimization. These optimizations are critical for TV apps where smooth 60fps performance is essential for a good user experience.

## X.1: Detect Component Re-renders

First, let's identify which components are re-rendering unnecessarily. Excessive re-renders can cause UI jank and poor performance, especially on TV devices.

### Use React DevTools Profiler (Optional)

If you have React DevTools installed, you can use the Profiler to record interactions and see which components are re-rendering. However, for Vega apps, we'll use a more direct approach.

### Add Re-render Detection

Let's add some logging to detect re-renders in our components. Prompt:

```
I want to detect unnecessary re-renders in my HomeScreen component. Add console logging that shows when the component re-renders and what props/state changed. Use useEffect hooks to track this.
```

Your AI agent should add something like:

```typescript
useEffect(() => {
  console.log('HomeScreen rendered');
});

useEffect(() => {
  console.log('ContentRows changed:', contentRows.length);
}, [contentRows]);
```

### Test for Re-renders

Navigate through your app and watch the console logs. Look for:
- Components rendering multiple times when they shouldn't
- Parent components causing child re-renders
- State updates triggering unnecessary renders

Common issues to look for:
- Creating new objects/arrays in render functions
- Inline function definitions in props
- Missing dependency arrays in useEffect/useCallback

## X.2: Optimize with React.memo and useCallback

Now let's fix any re-rendering issues we found. Prompt:

```
I want to optimize my HomeScreen to prevent unnecessary re-renders. Use React.memo for child components and useCallback for event handlers. Focus on the content row items and the FlatList renderItem function.
```

Your AI agent should:
1. Wrap child components with `React.memo()`
2. Use `useCallback` for event handlers
3. Use `useMemo` for computed values
4. Ensure proper dependency arrays

Example optimization:

```typescript
const ContentItem = React.memo(({ item, onPress, isFocused }: ContentItemProps) => {
  return (
    <Pressable onPress={onPress} style={[styles.item, isFocused && styles.focusedItem]}>
      <Image source={{ uri: item.images.thumbnail_16x9 }} style={styles.thumbnail} />
    </Pressable>
  );
});

const handleItemPress = useCallback((item: MovieItem) => {
  navigation.navigate('Detail', {
    bannerImage: item.images.poster_16x9,
    title: item.title,
    description: item.description,
    videoUrl: item.sources[0]?.url || '',
  });
}, [navigation]);
```

## X.3: Optimize FlatList Performance

FlatList can be a performance bottleneck if not configured properly. Let's optimize it for TV.

### Add FlatList Performance Props

Prompt:

```
Optimize the FlatList components in my HomeScreen for better performance. Add appropriate props like windowSize, maxToRenderPerBatch, initialNumToRender, and removeClippedSubviews. Use values appropriate for a TV app with horizontal scrolling.
```

Your AI agent should add props like:

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
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

### Use getItemLayout

The `getItemLayout` prop is crucial for performance as it allows FlatList to skip measuring items. Make sure your items have consistent sizes.

## X.4: Measure Performance Improvements

Now let's measure if our optimizations made a difference.

### Re-run Performance Tests

Follow the same steps from [Phase 4: Performance Testing](4_performance_testing.md) to:
1. Build in release mode
2. Run KPI Visualizer
3. Compare TTFF and TTFD metrics

### Check Re-render Logs

Navigate through your app again and verify:
- Fewer console logs showing re-renders
- Smoother navigation between screens
- Better focus management responsiveness

### Use AI-Assisted Diagnosis

If you still see performance issues, use the "Diagnose with AI" feature from the KPI report to get specific recommendations.

Prompt:

```
Analyze my app's performance data and suggest additional optimizations for re-rendering and list performance.
```

## X.5: Additional Optimization Techniques

### Lazy Loading

For apps with many screens, consider lazy loading components:

```
Implement lazy loading for my Details and VideoPlayer screens using React.lazy and Suspense.
```

### Image Optimization

Optimize image loading and caching:

```
Add image caching and optimize image loading in my content rows. Use appropriate image sizes and implement placeholder images.
```

### Debounce Focus Events

If focus changes are causing performance issues:

```
Add debouncing to focus event handlers to prevent rapid state updates when users quickly navigate with the d-pad.
```

## X.6: Verify Optimizations

Build and test your optimized app:

1. Build in release mode
2. Test on physical Fire TV device
3. Navigate through all screens
4. Verify smooth 60fps performance
5. Check memory usage hasn't increased

Common signs of good performance:
- Instant response to d-pad navigation
- Smooth scrolling through content rows
- No dropped frames during transitions
- Fast screen transitions

---

**Previous:** [Replace FlatList](5_replace_flatlist.md) | **Next:** [Wrap Up and Next Steps](6_wrap_up_and_next_steps.md)
