# Phase 7: In-App Purchases (IAP)

In this phase, we'll add monetization feature to your TV app using Amazon's In-App Purchasing SDK. The MCP server includes self-sufficient IAP workflows that guide you through the entire process — you just kick it off with a single prompt and respond to the agent's questions as it walks you through each phase.

> **Prerequisites:**
> - Completed [Phase 6: Accessibility](6_accessibility.md) (or at minimum, a working 3-screen app from Phase 3)
> - MCP server running (configured in [Phase 2](2_set_up_mcp_server.md))
> - A physical Vega Fire TV device with [Developer Mode](https://developer.amazon.com/docs/vega/0.21/developer-mode.html) enabled (required for IAP testing)
> - An [Amazon Developer account](https://developer.amazon.com/) (free to create)

## How This Works

Unlike previous phases where we gave you specific prompts for each sub-step, the IAP integration uses **MCP workflows** — structured, multi-step guides that the agent follows autonomously. You trigger the workflow with a single prompt, and the agent:

1. Reads the workflow document via the MCP server
2. Executes each step sequentially
3. **Stops and asks you** whenever it needs input (credentials, SKU choices, test confirmations)
4. Moves to the next phase automatically when complete

You just react to the agent's questions and confirm when steps are done. The workflow handles the rest.

---

## 7.1: Kick Off IAP Integration

**Prompt:**

```
I want to integrate In-App Purchases into my Vega app. Help me set up IAP.
```

That's it. The agent will find and execute the IAP workflows in sequence:

| Phase | Workflow | What Happens |
|-------|----------|--------------|
| 1/5 | Setup | Validates environment, configures IAP SDK dependency, updates manifest |
| 2/5 | Define Items | Collects your SKU definitions, generates tester JSON |
| 3/5 | Implement Code | Generates IAP client code (hooks, handlers, receipt management, UI) |
| 4/5 | Testing | Sets up App Tester sandbox and/or DevTest production testing |
| 5/5 | Submission | Guides app submission with IAP items (not yet fully integrated) |

---

## What to Expect

### Phase 1: Setup

The agent will:
- Check your Node.js, Vega CLI, and VDA versions
- Ask for your **developer_id** and **shared_secret** (you can say "later" to defer)
- Ask for your **app_id** from the Developer Console (you can say "later" to defer)
- Add `@amazon-devices/keplerscript-appstore-iap-lib` to `package.json`
- Add IAP service entries to `manifest.toml`
- Verify the project builds

> **Tip:** It's OK to say "later" or "not yet" for credentials — the agent will mark them as PENDING and continue with the technical setup. You'll need them before testing.

**Checkpoint:** Your `manifest.toml` should contain IAP service entries (`com.amazon.iap.tester.service`, `com.amazon.iap.core.service`) and your `package.json` should have the IAP library dependency. `vega build` should pass.

Commit changes: `git add * && git commit -m "Add IAP SDK configuration"`

### Phase 2: Define Items

The agent will ask what you want to sell. For this workshop, a simple subscription works well:

> "Create a sample subscription item with good assumed values"

It will:
- Define the SKU hierarchy (parent + term)
- Save configuration to `iap_config.json`
- Guide you to create the item in the Developer Console (or defer)
- Generate `amazon.sdktester.json` for local testing

> **Already have IAP items defined?** If you've already created your items in the Developer Console, you can skip the definition step — just download the `amazon.sdktester.json` from the console (In-App Items tab → "Export Multiple IAPs" → select JSON) and provide it to the agent. It will use your existing SKUs for code generation and testing.

> **Tip:** If the workflow helped you define new IAP items, remember to submit them in the [Developer Console](https://developer.amazon.com/) (In-App Items tab → select your items → "Submit"). Items must be submitted and live before they can be used with Part B (DevTest) testing or in production.

**Checkpoint:** You should have `iap_config.json` and `amazon.sdktester.json` in your project root. The tester JSON should contain your purchasable term SKU(s).

Commit changes: `git add * && git commit -m "Define IAP items and tester config"`

### Phase 3: Implement Code

The agent generates multiple files (exact paths may vary slightly):

| File | Purpose |
|------|---------|
| `src/utils/IAPConstants.ts` | SKU definitions |
| `src/utils/IAPSDKResponseHandler.ts` | Handles all SDK API responses |
| `src/utils/dao/IAPTransactionsDAO.ts` | Receipt persistence (stub) |
| `src/utils/IAPManager.ts` | Receipt handling business logic |
| `src/hooks/iap/useIAP.ts` | React hook for IAP integration |

It also wires up purchase and "Restore Purchases" buttons into your existing UI, using real product data (title, price) from the store — never hardcoded values.

When asked about **RVS server generation**, you can say "no" for this workshop (it's for production receipt verification).

**Checkpoint:** Run `vega build` to verify the generated code compiles. You should see new files in `src/utils/` and modifications to your screen components with Subscribe and Restore Purchases buttons.

Commit changes: `git add * && git commit -m "Implement IAP client code"`

### Phase 4: Testing

The agent will ask which testing method you want:

| Part | Method | Environment | Best For |
|------|--------|-------------|----------|
| **A** | App Tester | Sandbox (mock responses) | Local testing of IAP API calls |
| **B** | Appstore DevTest | Production (real Amazon servers) | Integration testing without binary upload |

**For this workshop, choose Part A** (App Tester). The agent will:
1. Start/verify the VDA
2. Download and install the App Tester
3. Push your `amazon.sdktester.json` to the device
4. Enable sandbox mode
5. Build and deploy your app
6. Generate a test plan
7. Hand off to you for manual testing

**Part B (DevTest)** requires your IAP items to be live in the Developer Console. It involves certificate generation, VPKG signing, and sideloading for production-environment testing. The agent will walk you through it when you're ready.

---

## Manual Testing

Once the agent completes Part A setup, test the following on your device:

| Test | Expected Result |
|------|----------------|
| Navigate to Details screen | Subscribe button shows real price from store data |
| Press Subscribe | App Tester purchase dialog appears |
| Complete purchase | Console logs show `notifyFulfillment FULFILLED` |
| Press Restore Purchases | Previously purchased items are restored |
| Restart app | Purchase state persists via `getPurchaseUpdates` |

To switch between your app and the App Tester on the VDA:
```bash
# Launch App Tester (to configure responses)
vlcm launch-app pkg://com.amazonappstore.iap.tester.ui

# Launch your app (replace with your package ID from manifest.toml)
vlcm launch-app pkg://<your.package.id>
```

**Checkpoint:** You should be able to complete a full purchase flow in sandbox mode — from tapping "Subscribe" through to seeing the `notifyFulfillment FULFILLED` message in your console logs.

---

## Summary

After completing this phase, your app will have:

- IAP SDK configured (dependency + manifest entries)
- Purchasable items defined (subscription with parent/term hierarchy)
- Complete IAP client code (hooks, response handlers, receipt management)
- Purchase and Restore buttons in the UI
- Sandbox testing verified via App Tester

**Before production, remember to:**
- Replace the receipt verification stub with server-side RVS
- Replace the DAO stub with production-appropriate storage
- Fill in `// TODO` sections for granting/revoking content
- Complete Part B (DevTest) testing
- Run Phase 5 (Submission) when ready to publish

> **Note:** The Submission workflow (Phase 5) is not yet fully integrated into the MCP server. The workflows currently support the end-to-end flow up through Testing (Phase 4). For app submission guidance, refer to the [Vega app submission docs](https://developer.amazon.com/docs/vega/0.21/app-submission.html).

---

**Previous:** [Accessibility](6_accessibility.md) | **Next:** [Wrap Up and Next Steps](8_wrap_up_and_next_steps.md)
