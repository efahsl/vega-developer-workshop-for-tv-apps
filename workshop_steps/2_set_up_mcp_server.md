# Phase 2: Set up MCP Server

**Model Context Protocol (MCP)** is an open standard that defines how AI applications can securely connect to external tools, data sources, and services. MCP acts like a "USB port for AI applications" - providing a standardized way to connect AI models to different systems to access external knowledge/capabilities without requiring additional training. Common examples include connecting AI agents to file systems for reading/writing files, accessing web search engines and APIs, connecting to communication tools like Slack or email systems, and providing specialized development tools and workflows (which is what we are going to use it for).

You can learn more about the protocol specification at [modelcontextprotocol.io/](http://modelcontextprotocol.io/).

## 2.1 Install & Configure Vega MCP Server

While you can use most AI Agent models as-is to make changes to the Vega Hello World App, for better results developing Vega Apps with AI we have a Vega MCP server to provide additional relevant context to your AI Agent. Below we walk through the three required steps to set up the Vega MCP server with your Vega project.

> ℹ️ The steps in these guide have primarily been tested with Claude Sonnet 3.5, 4 & 4.5, using Copilot, Kiro, Claude Code, and Amazon Q. While we expect other models and tools to behave similarly, we cannot control the response of every model/tool.
>
> ℹ️ Don't have an AI agent/tool? Try Amazon Kiro, it comes with 500 free credits upon first use and should more than suffice for this workshop: <https://kiro.dev/>. We use it quite a bit and is one of our favorites!

**Download our Vega MCP Server tarball** _(in the future we will improve this experience, but for now it requires a manual download)_ - Download [vega-devtools-mcp.tgz](https://quip-amazon.com/-/blob/XHR9AAz7WE2/Ovlq-285mjReHWvC_FEeHg?name=vega-devtools-mcp.tgz&s=ROPyAzh306H2). Note down the download path

Run an npm install from the tarball as global scope (or local to your project if you prefer)

```bash
$ npm install -g {PATH_TO_DOWNLOADED_FOLDER}/vega-devtools-mcp.tgz
```

**Install MCP server to your AI Agent**

You will now need to add the MCP configuration in your AI Agent's MCP settings, so that your agent can call our MCP. Each Agent has slightly different instructions, but many involve using an "mcp.json" (or similar) file where you can add the specific configuration for this new MCP server we just installed.

Below we list some popular AI agents and the link to how to install MCP servers - note that we are using local/stdio MCPs.

| #   | AI Agent        | MCP Setup Instructions Link                                                                                                                                    | MCP Settings File Location                                                                                    |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Cursor          | [Instructions](https://cursor.com/docs/context/mcp#using-mcpjson)                                                                                              | ~/.cursor/mcp.json                                                                                            |
| 2   | Github Copilot  | [Instructions](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp) then choose "Configuring MCP Servers Manually" | ~/.config/mcp-config.json<br/><project-root>/.vscode/mcp.json                                                 |
| 3   | Claude Code CLI | [Instructions](https://code.claude.com/docs/en/mcp#option-3%3A-add-a-local-stdio-server)                                                                       | ~/.claude.json<br/>/Library/Application Support/ClaudeCode/managed-mcp.json                                   |
| 4   | Amazon Q        | [Instructions](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-mcp-config-CLI.html)                                                      | ~/.aws/amazonq/mcp.json                                                                                       |
| 5   | Kiro            | [Instructions](https://kiro.dev/docs/mcp/)                                                                                                                     | ~/.kiro/settings/mcp.json                                                                                     |
| 6   | Cline           | [Instructions](https://docs.cline.bot/mcp/configuring-mcp-servers)                                                                                             | ~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json |

_If your agent is not listed, please ensure it supports MCP before continuing._

Now for the content to update, we have a few short steps:

First, run the following command to get the binary location and copy the location

```bash
% which vega-devtools-mcp
```

And you'll get an output that _could_ be something like the following (your node version may be different)

```
/Users/YOUR_HOME_FOLDER/.nvm/versions/node/v20.19.4/bin/vega-devtools-mcp
```

or the following if node installed via homebrew

```
/opt/homebrew/bin/vega-devtools-mcp
```

Save this path, you will need for the next step, which is to update your MCP server configuration to add the "vega-devtools-mcp" server to your list of servers. Replace the `{YOUR_PATH_TO_VEGA-DEVTOOLS-MCP-BINARY}` below with the path you just stored. Note that your specific tool may have minor variances, check your tools documentation as-needed to add new MCP servers.

```json
{
  "mcpServers|servers": {
    ...,
    "vega-devtools-mcp": {
      "type": "stdio",
      "command": "node",
      "args": [
        "{YOUR_PATH_TO_VEGA-DEVTOOLS-MCP_BINARY}"
      ]
    }
  }
}
```

> ℹ️ Important: Start the MCP Server from Agent's MCP config, if not already started - check your current running MCPs to ensure the vega-devtools-mcp is listed as running/connected.

## 2.2 Add Vega Context to AI Agent

The final step to using the MCP server is to add specific project configuration to look up additional prompts/context when using Vega-specific commands/components/libraries/etc. Make sure you are in your project directory.

Run the following command **within your App project**, to initialize Vega context for your AI Coding agent.

```bash
npx vega-devtools-mcp --init-context
```

Choose the AI Agent from the list. Enter 7 for "Other" AI agents not included in the list, to manually copy the Vega context in your project directory

```
% npx vega-devtools-mcp --init-context

====================================================
🚀 Vega Developer Tools - Initialize Vega Context
====================================================

This tool installs Vega App development context document in your project.
The context document guides AI agents to efficiently answer queries related to app development for Vega OS

Choose from the following options to automatically install Agent specific preset in your app project:

   1. Cursor - Adds AGENTS.md file

   2. Claude Code - Adds CLAUDE.md file

   3. GitHub Copilot - Adds AGENTS.md file

   4. Amazon Q - Adds .amazonq/rules/ directory

   5. Kiro - Adds .kiro/steering/ directory

   6. Cline - Adds .clinerules/ directory

   7. Other AI agent or custom setup - View content only

Select an AI agent (1-7):
```

| #   | AI Agent       | Project Context Location           |
| --- | -------------- | ---------------------------------- |
| 1   | Cursor         | project-root/AGENTS.md file        |
| 2   | Claude Code    | project-root/CLAUDE.md file        |
| 3   | Github Copilot | project-root/AGENTS.md file        |
| 4   | Amazon Q       | project-root/.amazonq/rules folder |
| 5   | Kiro           | project-root/.kiro/steering folder |
| 6   | Cline          | project-root/.clinerules/ folder   |

If these do not properly load for you, you can always say the following at the start of any AI agent session: `use AGENTS.md for context`

**Verify AI agent is configured with Vega Context:**

In your AI Agent's chat interface, run the following prompt:

```
Can you describe the Vega Platform Architecture in one sentence?
```

> ℹ️ **Important**: ensure the MCP tool read_document is triggered! You will need to grant permission to read, we recommend always allowing for the given workspace. It may look something like the following:

```
vega-devtools-mcp - read_document (MCP)(document_name: "react_native_for_vega_architecture.md")
⎿ #react_native_for_vega_architecture.md

## High-Level Architecture
... +59 lines (ctrl+o to expand)
```

or the following with an AI IDE or extension:

<img src="../images/XHR96290dcb2cd74fc68ab4ecfd8.png" width="640">

You should get a response similar to:

```
Vega is a TV platform that uses a system-bundled React Native runtime (rather than app-bundled), where
  applications only package their JavaScript code and dynamically link to the OS-provided React Native
  framework and native services at runtime for optimized performance and resource sharing.
```

Verify if AI Agent made a tool call to vega-devtools-mcp to read Vega Architecture document.

<img src="../images/XHR300f5b9dcd9a4d52b4223abe4.png" height="400">

---

**Previous:** [Create a Hello World App](1_create_hello_world_app.md) | **Next:** [Checkpoint: Get Fire TV Device](2_zCheckpoint_get_firetv_device.md)
