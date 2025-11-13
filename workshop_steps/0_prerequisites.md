# Prerequisites

## 1. Install Vega Developer Tools

If you dont have a Amazon Developer Account, run the following command in your terminal window to install Vega Dev Tools:

```
curl -fsSL https://kepler-static-artifacts.kepler.labcollab.net/ac/ac49b8ada5a344c94cf217bc79e428c16fe9c7b7c54de35518b998d08a594ec1 | /bin/bash -s -- --sdk-url=https://kepler-static-artifacts.kepler.labcollab.net/e0/e08aa6eac37743f5e33a34ffe47ef6d5a1a5b36a74fa23afc7eaf0f7855e3d49 --sim-url=https://kepler-static-artifacts.kepler.labcollab.net/2f/2f0d567689712f1606577dacd88388c46c965de62cc66260da2b53c2202d02ec --version=0.21.4839
```

In order to participate in this workshop, you will need to have the Vega SDK installed: [Download and Installation Guide](https://developer.amazon.com/docs/vega/0.21/setup-overview.html)

Vega requires macOS 10.15+ or Ubuntu 20.4+. We recommend M-series macs for the best experience.

Depending on network speeds, this installation can take 5-15 minutes. We strongly recommend you download and install prior to the workshop.

Additionally, to use our MCP (Model Context Protocol) server or AI prompts you will need at-least one AI Coding assistant such as Cursor, Claude Code, Copilot, Kiro, Amazon Q, Cline, etc. We have included support for these first 6 and have tested primarily on Kiro, Claude Code, and Amazon Q with Claude Sonnet 4/4.5 models - but we expect these prompts to work across most models. To learn more about MCPs, visit [modelcontextprotocol.io/](http://modelcontextprotocol.io/) or see our footnote below.

> Note: coding with AI/LLMs is non-deterministic by nature, which means that the result is always going to be different. You will need to carefully inspect each step and ensure your app is properly functioning before proceeding with more functionality.

**\*Model Context Protocol (MCP)** is an open standard that defines how AI applications can securely connect to external tools, data sources, and services. MCP acts like a "USB port for AI applications" - providing a standardized way to connect AI models to different systems to access external knowledge/capabilities without requiring additional training. Common examples include connecting AI agents to file systems for reading/writing files, accessing web search engines and APIs, connecting to communication tools like Slack or email systems, and providing specialized development tools and workflows (which is what we are going to use it for).\*

---

**Next:** [Create a Hello World App](1_create_hello_world_app.md)
