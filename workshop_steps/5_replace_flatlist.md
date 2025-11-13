# Phase 5: Replace FlatList

## Use Vega Native UI Components

The existing FlatList implementation is a bit slow, especially when running on the physical Vega device. Vega has a Native Carousel component as part of the kepler-ui-components library, which also provides us additional UX options more fit for TV (maintaining the focus position fixed to the left-most element of the screen). Let's replace our FlatList with the following prompt:

```
I want to replace my existing FlatList Rows on HomeScreen.tsx with the Vega Kepler Carousel component from the "@amazon-devices/kepler-ui-components" library (update my package.json and npm install if necessary). Migrate our existing FlatList (using the same image and dimensions) over to the Carousel. I also want to use the FocusIndicator of "fixed" on the Carousel props. Any questions?
```

You should now see the content row "slide" behind your focused item (see below) and it should be MUCH faster especially on-device. Try running your performance tools again for UI fluidity to see a faster set of results.

_BEFORE_

<img src="../images/vega-flatlist-animated.gif">

_AFTER_

<img src="../images/vega-carousel-animated.gif">

---

**Previous:** [Performance Testing](4_performance_testing.md) | **Next:** [Wrap Up and Next Steps](6_wrap_up_and_next_steps.md)
