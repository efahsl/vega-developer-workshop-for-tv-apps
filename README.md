# Vega Developer Workshop for TV Apps

Welcome! This hands-on workshop will guide you through building a TV streaming app using [Amazon's Vega Developer Tools](https://developer.amazon.com/apps-and-games/vega), [Amazon Devices Builder Tools for AI (ADBT for AI)](https://www.npmjs.com/package/@amazon-devices/amazon-devices-buildertools-mcp), and AI prompts.

## What You'll Build

You'll create a 3-screen media streaming app optimized for TV, featuring:

- A browsable content library with multiple categories
- Detailed content information screens
- Video playback capabilities
- TV-optimized navigation and focus management
- Performance optimization and re-rendering improvements
- Accessibility features for screen readers and D-pad navigation

<img src="./images/screen1-list.png" width="640">
<img src="./images/screen2-detail.png" width="640">
<img src="./images/screen3-playback.png" width="640">

## What You'll Learn

- How to develop React Native apps for TV using the Vega Developer Tools
- AI-assisted development using Amazon Devices Builder Tools for AI (ADBT for AI), an MCP (Model Context Protocol) server, context document, and agent skills
- Performance testing and optimization techniques for TV apps
- Identifying and fixing unnecessary component re-renders
- Implementing TV accessibility features (focus management, screen readers)
- Best practices for 10-foot UI design and D-pad navigation

## Prerequisites

Check out our [Prerequisites](workshop_steps/0_prerequisites.md) page to install **Amazon Devices Builder Tools for AI (ADBT for AI)** and then use it to install the **Vega SDK** via an AI prompt. In order to run any of the performance capabilities, you will need a Vega Fire TV Stick with [Developer Mode](https://developer.amazon.com/docs/vega/latest/developer-mode.html) enabled. We also highly recommend reading about the Vega architecture and component APIs to have a better understanding of the SDK capabilities as you run through this workshop.

## Workshop Steps

0. **[Prerequisites](workshop_steps/0_prerequisites.md)** - Install ADBT for AI, then install the Vega SDK via an AI prompt
1. **[Create a Hello World App](workshop_steps/1_create_hello_world_app.md)** - Create your first Vega app with an AI prompt
2. **[Create a 3 Screen App](workshop_steps/2_create_3_screen_app.md)** - Build the home screen, details screen, and video player
3. **[Performance Testing](workshop_steps/3_performance_testing.md)** - Run your app on Fire TV Stick and benchmark performance
4. **[Optimize Re-rendering Performance](workshop_steps/4_optimize_rerendering_performance.md)** - Detect and fix unnecessary component re-renders
5. **[Accessibility](workshop_steps/5_accessibility.md)** - Implement TV accessibility features for better user experience
6. **[Wrap Up and Next Steps](workshop_steps/6_wrap_up_and_next_steps.md)** - Explore additional project ideas and app submission

## Getting Started

Begin with the [Prerequisites](workshop_steps/0_prerequisites.md) to ensure you have all necessary tools installed, then follow the workshop steps in order.

## Toubleshooting

Running into issues? Check out our [troubleshooting guide](https://developer.amazon.com/docs/vega/latest/troubleshoot-overview.html) on our [Vega Developer Docs](https://developer.amazon.com/apps-and-games/vega).

Prefer to see a working code example to compare what you have built? Check out our reference code example in this repo [here](./reference/RnlConfApp/).
