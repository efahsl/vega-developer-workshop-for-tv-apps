# Phase 6: TV Accessibility

TV apps have unique accessibility requirements. Users navigate with D-pad remotes from 10 feet away, and some rely on screen readers or have visual impairments. In this phase, we'll implement critical accessibility improvements for HomeScreen—focusing on focus management, screen reader support, and visual indicators.

## Why TV Accessibility Matters

Unlike mobile apps where users tap directly on elements, TV users must navigate sequentially using D-pad controls. This makes focus management critical:

- **Focus must be predictable** — Users need to know where focus will move next
- **Focus must be visible** — The focused element must be clearly distinguishable
- **Content must be announced** — Screen reader users need context about what's focused

Poor accessibility on TV isn't just an inconvenience—it can make your app completely unusable for some users.

---

## 6.1: Add TVFocusGuideView for Predictable Navigation

**The Problem:**

Our HomeScreen uses standard `FlatList` components for horizontal content rows. Without explicit focus guidance, the D-pad navigation can behave unpredictably:

- Focus may jump to unexpected items when moving between rows
- Users can get "trapped" in a horizontal list
- Vertical navigation between rows may skip items or jump erratically

This happens because React Native's default focus engine doesn't understand the spatial layout of TV content grids.

**Prompt your agent:**

```
Add TVFocusGuideView to the ContentRow component in HomeScreen.tsx to improve D-pad navigation between rows. The focus guide should help users navigate vertically between content rows in a predictable way. Wrap the FlatList in TVFocusGuideView with autoFocus enabled.
```

**Expected result:**

```typescript
import {TVFocusGuideView} from 'react-native';

const ContentRow = ({title, items, onItemPress, onItemFocus}: ContentRowProps) => {
  const renderItem = ({item}: {item: MovieItem}) => {
    return (
      <ThumbnailItem
        item={item}
        onPress={() => onItemPress(item)}
        onFocus={() => onItemFocus(item)}
      />
    );
  };

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      <TVFocusGuideView autoFocus>
        <FlatList
          data={items}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}-${item.id}`}
          showsHorizontalScrollIndicator={false}
        />
      </TVFocusGuideView>
    </View>
  );
};
```

**Why it works:** `TVFocusGuideView` creates a focus "container" that helps the focus engine understand your layout. When users press up/down, focus moves to the nearest focusable element in the adjacent `TVFocusGuideView` rather than jumping unpredictably.

### Test the Navigation

After implementing, navigate through your content rows:
- Press Down from the first row — focus should move to the item directly below (or nearest)
- Press Up from the second row — focus should return to the first row predictably
- Horizontal navigation within a row should remain smooth

---

## 6.2: Add Accessibility Labels to Interactive Elements

**The Problem:**

Our `ThumbnailItem` and `Pressable` components have no accessibility information. Screen reader users hear nothing meaningful when focusing on content—they don't know what movie they're on or what will happen when they press Select.

**Current code:**
```typescript
<Pressable
  style={[styles.thumbnail, focused && styles.thumbnailFocused]}
  onFocus={() => { setFocused(true); onFocus(); }}
  onBlur={() => setFocused(false)}
  onPress={onPress}>
  <Image source={{uri: item.images.thumbnail_450x253}} ... />
</Pressable>
```

A screen reader would announce something like "Button" — completely unhelpful.

**Prompt your agent:**

```
Add accessibility props to the ThumbnailItem component in HomeScreen.tsx. Include accessibilityLabel with the movie title and category, accessibilityHint explaining what happens on press, and accessibilityRole set to "button". The item data is available in the component props.
```

**Expected result:**

```typescript
const ThumbnailItem = ({item, onPress, onFocus}: ThumbnailItemProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      style={[styles.thumbnail, focused && styles.thumbnailFocused]}
      onFocus={() => {
        setFocused(true);
        onFocus();
      }}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      accessibilityLabel={`${item.title}, ${item.category}`}
      accessibilityHint="Press to view details"
      accessibilityRole="button">
      <Image
        source={{uri: item.images.thumbnail_450x253}}
        style={styles.thumbnailImage}
        resizeMode="cover"
        accessibilityElementsHidden={true}
      />
    </Pressable>
  );
};
```

**Why it works:** 
- `accessibilityLabel` tells screen readers what the element represents
- `accessibilityHint` explains what action will occur
- `accessibilityRole="button"` indicates it's interactive
- `accessibilityElementsHidden` on the Image prevents redundant announcements

Now screen readers announce: "Inception, Sci-Fi, button. Press to view details."

---

## 6.3: Implement Initial Focus Management

**The Problem:**

When HomeScreen loads, there's no defined initial focus. Users must press a D-pad direction to discover where focus starts. This is disorienting—especially for screen reader users who receive no announcement until they navigate.

**Prompt your agent:**

```
Add initial focus management to HomeScreen.tsx so the first thumbnail in the first content row receives focus automatically when the screen loads. Pass an isFirstItem prop to ThumbnailItem and use the autoFocus prop on the Pressable for the first item only.
```

**Expected result:**

Update ThumbnailItem to accept and use autoFocus:

```typescript
interface ThumbnailItemProps {
  item: MovieItem;
  onPress: () => void;
  onFocus: () => void;
  autoFocus?: boolean;
}

const ThumbnailItem = ({item, onPress, onFocus, autoFocus}: ThumbnailItemProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      style={[styles.thumbnail, focused && styles.thumbnailFocused]}
      onFocus={() => {
        setFocused(true);
        onFocus();
      }}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      autoFocus={autoFocus}
      accessibilityLabel={`${item.title}, ${item.category}`}
      accessibilityHint="Press to view details"
      accessibilityRole="button">
      <Image ... />
    </Pressable>
  );
};
```

Update ContentRow to pass the autoFocus prop:

```typescript
interface ContentRowProps {
  title: string;
  items: MovieItem[];
  onItemPress: (item: MovieItem) => void;
  onItemFocus: (item: MovieItem) => void;
  isFirstRow?: boolean;
}

const ContentRow = ({title, items, onItemPress, onItemFocus, isFirstRow}: ContentRowProps) => {
  const renderItem = ({item, index}: {item: MovieItem; index: number}) => {
    return (
      <ThumbnailItem
        item={item}
        onPress={() => onItemPress(item)}
        onFocus={() => onItemFocus(item)}
        autoFocus={isFirstRow && index === 0}
      />
    );
  };
  // ...
};
```

Update HomeScreen to pass isFirstRow to the first ContentRow:

```typescript
{trendingMovies.length > 0 && (
  <ContentRow
    title="Trending Now"
    items={trendingMovies}
    onItemPress={handleItemPress}
    onItemFocus={handleItemFocus}
    isFirstRow={true}
  />
)}
```

**Why it works:** The `autoFocus` prop tells React Native to focus this element when it mounts. By only setting it on the first item of the first row, users immediately know where they are when the screen loads.

---

## 6.4: Improve Focus Indicator Visibility

**The Problem:**

Our current focus indicator uses a white border:

```typescript
thumbnailFocused: {
  borderWidth: 4,
  borderColor: '#FFFFFF',
  transform: [{scale: 1.05}],
}
```

This can be hard to see when:
- The thumbnail image has light edges
- Users have visual impairments
- The TV has poor contrast settings

A focus indicator must be visible in all conditions—it's the user's only way to know where they are.

**Prompt your agent:**

```
Improve the focus indicator styles in HomeScreen.tsx for better visibility. Increase the border width to 6px, add a dark shadow/glow effect for contrast against light backgrounds, and increase the scale transform to 1.1 for more noticeable size change.
```

**Expected result:**

```typescript
thumbnailFocused: {
  borderWidth: 6,
  borderColor: '#FFFFFF',
  shadowColor: '#000000',
  shadowOffset: {width: 0, height: 0},
  shadowOpacity: 0.9,
  shadowRadius: 12,
  elevation: 15,
  transform: [{scale: 1.1}],
},
```

**Why it works:**
- **Thicker border (6px)** — More visible from 10-foot viewing distance
- **Dark shadow** — Creates contrast against light image edges
- **Larger scale (1.1)** — Makes the focused item "pop" more noticeably
- **elevation** — Ensures shadow renders on Android/Fire TV

### Additional Enhancement: Add Semantic Headers

While updating styles, also add semantic structure to the row titles:

**Prompt your agent:**

```
Add accessibility role "header" to the row title Text components in ContentRow so screen readers announce them as section headers.
```

**Expected result:**

```typescript
<Text 
  style={styles.rowTitle}
  accessibilityRole="header">
  {title}
</Text>
```

---

## Testing Your Accessibility Improvements

TODO: ADD INSTRUCTIONS FOR ENABLING ACCESSIBILITY IN THE VEGA TV DEVICE.

After implementing all Phase 1 fixes, verify:

| Test | Expected Behavior |
|------|-------------------|
| App loads | First thumbnail is focused, screen reader announces it |
| Press Down | Focus moves to item below in next row |
| Press Up | Focus returns to previous row predictably |
| Focus any item | White border with shadow clearly visible |
| Screen reader on | Announces movie title, category, and "Press to view details" |
| Navigate rows | Row titles announced as headers |

---

## Summary

In this phase, you implemented critical TV accessibility improvements:

1. **TVFocusGuideView** — Predictable D-pad navigation between content rows
2. **Accessibility Labels** — Screen reader support with meaningful announcements
3. **Initial Focus** — Automatic focus on first item when screen loads
4. **Focus Indicators** — High-contrast visual feedback for focused elements

These changes ensure your app is usable by all viewers, regardless of ability.

---

**Previous:** [Optimize Re-rendering Performance](5_optimize_rerendering_performance.md) | **Next:** [Replace FlatList](7_replace_flatlist.md)
