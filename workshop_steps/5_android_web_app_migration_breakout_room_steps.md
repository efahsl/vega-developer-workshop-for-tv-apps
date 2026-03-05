# Breakout Room: Android Web App Migration

## Step 1: Verify MCP Setup

Ensure the `amazon-devices-buildertools-mcp` server is running/connected when you launch your AI agent. You should see it listed in your agent's MCP server list.

If you haven't set it up yet, follow [Prerequisites](0_prerequisites.md).

## Step 2: Check Out Your Web App Source Code

Clone or check out your existing FOS webview app's source code locally so your AI agent can access it.

## Step 3: Create your app with a prompt

### If you have a FOS Web App, prompt

```
Can you convert my FOS WebView App from {path_to_fos_web_app_source_code} into a Vega Web App at {path_you_want_vega_web_app_created}
```

Replace `{path_to_fos_web_app_source_code}` with the local path to your FOS web app source code, and `{path_you_want_vega_web_app_created}` with the destination path for the new Vega web app.

### If you do not have a FOS Web App, prompt

```
Create a Vega React Native app with a WebView pointing to {url}
```

## Step 4: Create a bridge with a prompt

```
Add WebView error handling, message bridge, and BackHandler for {url}
```

## Step 5: Connect controls and update manifest with a prompt

```
Add media controls, DRM support, and valid required manifest privileges to WebView
```

---

**Previous:** [Shaka Player Upgrade](4_shaka_player_upgrade.md)
