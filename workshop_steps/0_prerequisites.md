# Prerequisites

Before you start the workshop, complete the following one-time setup. This gets your machine ready with **Amazon Devices Builder Tools for AI (ADBT for AI)**: the suite you'll use throughout the workshop, and installs the **Vega SDK** via a prompt.

The full setup takes ~15–30 minutes depending on network speed.

> **Version note:** This workshop is validated against ADBT for AI **1.0.9 or higher**. `npx ... @latest` always picks up the newest published version.

---

## 1. Hardware & Operating System

- **macOS 10.15+** or **Ubuntu 20.04+** (M-series Macs recommended for the best experience).
- (Recommended for Phases 3 and 4) A **Vega Fire TV Stick** with [Developer Mode](https://developer.amazon.com/docs/vega/latest/developer-mode.html) enabled. The Vega Virtual Device works for most phases, but real-device runs give the most accurate performance measurements.

## 2. Install Node.js

ADBT for AI and Vega apps both need **Node.js 16 or higher**.

```bash
node --version
```

If Node isn't installed (or is older than v16), install it from [nodejs.org](https://nodejs.org/) or via your package manager (`brew install node` on macOS, `apt install nodejs npm` on Ubuntu).

## 3. Install an AI Coding Agent

You need at least one AI coding agent to work through the workshop. ADBT for AI supports these agents out of the box:

| Agent                         | Notes                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| **[Kiro](https://kiro.dev/)** | Recommended for newcomers, 500 free credits on first use, more than enough for this workshop. |
| **Claude Code**               | CLI, tested extensively with Claude Sonnet 4 / 4.5.                                            |
| **Cursor**                    | IDE, one-click install available from the npm package page.                                    |
| **GitHub Copilot**            | VS Code extension.                                                                             |
| **Cline**                     | VS Code extension.                                                                             |
| **OpenCode**                  | CLI.                                                                                           |
| **Codex**                     | CLI.                                                                                           |

Additional agents (e.g., Gemini CLI, Amazon Q) can be configured manually, see the [Amazon Devices Builder Tools for AI package](https://www.npmjs.com/package/@amazon-devices/amazon-devices-buildertools-mcp) for the current supported list.

> Note: coding with AI/LLMs is non-deterministic by nature, the result will differ every time. Inspect each step and make sure your app is working before proceeding.

## 4. Install Amazon Devices Builder Tools for AI (ADBT for AI)

ADBT for AI is a suite of AI-powered development tools for Fire TV / Vega. Running one command installs three things into your agent:

1. **The ADBT MCP server**: an MCP (Model Context Protocol) server exposing curated Amazon Devices tools (`read_document`, `list_documents`, `search_documentation`, `read_asset`, `analyze_perfetto_traces`, `get_app_hot_functions`, `symbolicate_acr`).
2. **A context (steering) document**: Amazon Devices platform context that primes your agent for Vega/FireOS work.
3. **Skills**: modular, on-demand instruction packages the agent activates without MCP round-trips (e.g., `amazon-devices-vega-setup-sdk`, `amazon-devices-vega-build-and-run`, `amazon-devices-vega-focus-management`, plus community skills such as `vega-multi-tv-migration`).

**Run the installer from a terminal** (not from your agent's chat window):

```bash
npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context
```

The interactive installer will:

1. List supported AI agents and let you pick one.
2. Update that agent's MCP settings to register the ADBT MCP server.
3. Ask where to save the context document (defaults to the current directory).
4. Install the ADBT curated skills plus Amazon Developers community skills into your agent's skills directory.

**Non-interactive alternative** (e.g., for Kiro):

```bash
npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context --agent kiro --force
```

Supported `--agent` values: `cursor`, `claude-code-cli`, `github-copilot`, `kiro`, `cline`, `opencode`, `codex`.

If your agent was already running, restart it (or reload the MCP servers) so it picks up the new configuration.

### 4.1 Verify installation with `check-status`

```bash
npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest check-status
```

You should see something like:

```
Agent            │ Context Document         │ MCP Configuration
───────────────────────────────────────────────────────────────
Kiro             │ ✅ v4.0                   │ ✅ Configured
```

Both columns should show ✅. If either shows ❌ or `Partially configured`, rerun `init-context`.

### 4.2 Verify MCP tools in your agent

In your agent's chat, run:

```
List the tools provided by Amazon Devices Builder Tools MCP
```

Your agent should call the ADBT MCP server and list **7 tools**:

- `analyze_perfetto_traces`
- `get_app_hot_functions`
- `list_documents`
- `read_asset`
- `read_document`
- `search_documentation`
- `symbolicate_acr`

> ℹ️ Make sure the MCP tool call actually fires. You'll be asked to grant permission, "always allow" is fine for this workspace.

### 4.3 Verify the context document

In your agent's chat, run:

```
Can you describe the Vega Platform Architecture in one sentence?
```

The agent should call `read_document` to fetch `react_native_for_vega_architecture.md` and reply with something similar to:

```
Vega is a TV platform that uses a system-bundled React Native runtime
(rather than app-bundled), where applications only package their JavaScript
code and dynamically link to the OS-provided React Native framework and
native services at runtime for optimized performance and resource sharing.
```

If the response comes back without a `read_document` tool call, your context isn't wired up, rerun `init-context`.

### 4.4 (Optional) Tour the skills and MCP prompts

Skills are activated by intent, you describe what you want and the agent picks the right one. To see what's installed:

```
What ADBT skills do you have access to?
```

If your agent supports MCP prompts (Claude Code, Kiro CLI, etc.), list ADBT's slash prompts with:

```
/prompts
```

You should see entries such as `apply_performance_best_practices`, `detect_component_re-renders`, `diagnose_crash`, `diagnose_ui_fluidity`, `fix_hot_functions`, and `upgrade_carousel_component`. We'll use `detect_component_re-renders` in [Phase 4](4_optimize_rerendering_performance.md).

## 5. Install the Vega SDK via a Prompt

Instead of installing the Vega SDK manually, you'll now use ADBT's `amazon-devices-vega-setup-sdk` skill, which runs prerequisite checks, installs the SDK, and verifies the install.

**In your AI agent's chat window**, start a new session and run:

```
Help me setup the Vega SDK
```

The agent will pick up the `amazon-devices-vega-setup-sdk` skill and walk you through prerequisite checks, download, installation, and verification. Depending on network speed this takes 5–15 minutes.

**🏁 Checkpoint, verify the SDK:**

```bash
vega sdk list-installed
```

You should see at least one installed SDK of `0.24.X` (or higher).

> ℹ️ `vega --version` returns the **Vega CLI** version (e.g., `Vega CLI Version: 1.3.4`), which is separate from the SDK version, use `vega sdk list-installed` to check what SDK is installed. `kepler` is a legacy symlink to `vega` and still works, but `vega` is the canonical command.

---

## Appendix

### A. What is MCP?

**Model Context Protocol (MCP)** is an open standard that defines how AI applications securely connect to external tools, data sources, and services, a "USB port for AI applications." It provides a standardized way to connect AI models to different systems (file systems, search engines, communication tools, and, as in this workshop, specialized development tools and workflows).

Learn more at [modelcontextprotocol.io](https://modelcontextprotocol.io/).

### B. Manual Vega SDK Install (fallback)

If the prompt-based install doesn't work for your setup, follow the manual guide: [Vega SDK Download and Installation](https://developer.amazon.com/docs/vega/latest/setup-overview.html).

### C. Optional: Vega Studio VS Code extension

The [Vega Studio VS Code extension](https://developer.amazon.com/docs/vega/latest/setup-overview.html) provides an IDE-integrated sidebar with buttons for creating and running Vega apps. It's optional for this workshop, every step in the workshop is fully prompt- and CLI-driven, but if you already use VS Code, feel free to install it.

---

**Next:** [Create a Hello World App](1_create_hello_world_app.md)
