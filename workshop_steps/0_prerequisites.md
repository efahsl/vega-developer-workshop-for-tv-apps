# Prerequisites

## 1. Install Vega Developer Tools

In order to participate in this workshop, you will need the Vega CLI and a preview SDK installed.

Vega requires macOS 10.15+ or Ubuntu 20.4+. We recommend M-series Macs for the best experience. Node 20 is required if you intend to build apps for React Native 0.83.

### Step 1: Install Vega CLI

If you don't already have the Vega CLI (verify with `vega sdk -h`), install it:

```bash
export SKIP_SDK_INSTALL=true
curl -fsSL https://sdk-installer.vega.labcollab.net/get_vvm.sh | bash && source ~/vega/env
```

> We set `SKIP_SDK_INSTALL=true` because we'll install a specific preview SDK in the next step.

### Step 2: Install Preview SDK

1. Create a directory for the preview SDK:
   ```bash
   mkdir -p ~/vega_sdk_preview
   ```

2. Run the install command for your platform:

   **Mac Apple Silicon (M-series):**
   ```bash
   curl 'https://kepler-static-artifacts.kepler.labcollab.net/24/240c5fecec4f96b859383d67eecbda642430990d0048a917c3afcd9b12067d72' | bash -s -- --sdk-url='https://kepler-static-artifacts.kepler.labcollab.net/21/21fa7e1d935621b273abaed991ff7239de6b7d72eef497df418d4cdc464bbd81' --version=0.23.6188
   ```

   **Mac Intel:**
   ```bash
   curl 'https://kepler-static-artifacts.kepler.labcollab.net/24/240c5fecec4f96b859383d67eecbda642430990d0048a917c3afcd9b12067d72' | bash -s -- --sdk-url='https://kepler-static-artifacts.kepler.labcollab.net/e2/e2091eaf6c70b871367d6b7520fdc6f5dff3a2dd461c5e2fae28447fca6ebd7b' --version=0.23.6188
   ```

   **Linux x86_64:**
   ```bash
   curl 'https://kepler-static-artifacts.kepler.labcollab.net/24/240c5fecec4f96b859383d67eecbda642430990d0048a917c3afcd9b12067d72' | bash -s -- --sdk-url='https://kepler-static-artifacts.kepler.labcollab.net/76/7663983771c6e88dd36ea73554c4dc321845d76c770d5c4613523d2316596a93' --version=0.23.6188
   ```

3. When prompted for the install location, specify `~/vega_sdk_preview`.
4. **Do not** export any environment variables or PATH from the bootstrapper output.
5. Link and activate the preview SDK:
   ```bash
   vega sdk link --path ~/vega_sdk_preview
   vega --version   # verify 0.23.6188 or higher appears
   vega sdk use 0.23.6188
   ```

### Step 3: Configure npm for Preview Registry

1. Back up your existing `.npmrc`:
   ```bash
   cp ~/.npmrc ~/.npmrc.bak
   ```

2. Create a new `.npmrc` in your home directory (or project root) with:
   ```
   @amazon-devices:registry=https://k-artifactory-external.labcollab.net/artifactory/api/npm/rnpreview-npm-prod-local/
   always-auth=true
   strict-ssl=true
   ```

3. Clean your npm cache to avoid conflicts with the public registry:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   ```

> **After the workshop:** run the same cleanup commands above and restore your original `.npmrc` (`cp ~/.npmrc.bak ~/.npmrc`).

For full public SDK setup details, see the [Download and Installation Guide](https://developer.amazon.com/docs/vega/0.22/setup-overview.html).

Depending on network speeds, this installation can take 5-15 minutes. We strongly recommend you download and install prior to the workshop.

Additionally, to use our MCP (Model Context Protocol) server or AI prompts you will need at-least one AI Coding assistant such as Cursor, Claude Code, Copilot, Kiro, Amazon Q, Cline, etc. We have included support for these first 6 and have tested primarily on Kiro, Claude Code, and Amazon Q with Claude Sonnet 4/4.5 models - but we expect these prompts to work across most models. To learn more about MCPs, visit [modelcontextprotocol.io/](http://modelcontextprotocol.io/) or see our footnote below.

> Note: coding with AI/LLMs is non-deterministic by nature, which means that the result is always going to be different. You will need to carefully inspect each step and ensure your app is properly functioning before proceeding with more functionality.

**\*Model Context Protocol (MCP)** is an open standard that defines how AI applications can securely connect to external tools, data sources, and services. MCP acts like a "USB port for AI applications" - providing a standardized way to connect AI models to different systems to access external knowledge/capabilities without requiring additional training. Common examples include connecting AI agents to file systems for reading/writing files, accessing web search engines and APIs, connecting to communication tools like Slack or email systems, and providing specialized development tools and workflows (which is what we are going to use it for).\*

---

**Next:** [Clone and Run Reference App](1_clone_and_run_reference_app.md)
