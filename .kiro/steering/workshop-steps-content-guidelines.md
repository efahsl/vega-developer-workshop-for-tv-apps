---
inclusion: always
---

# Workshop Steps Content Guidelines

When writing or editing workshop step files in `workshop_steps/`, follow these guidelines:

- Explain the bug/issue before showing the fix so developers understand what they're looking at.
- Explain what each patch does and how it affects the app.
- Include the exact prompts developers should paste into their AI assistant.
- Start exercises with pre-created artifacts (e.g., CPU trace files) rather than generating them live.
- Remove any hint comments like `//Bad impl` from code samples.
- Name screens/components descriptively — avoid test-sounding names like "CrashTestScreen".
- Keep instructions paced: pause after every discernable action, account for steps taking a minute.
- Use the same agent (Kiro) and model (Opus 4.6) across all exercises.
- Keep README.md in sync with the actual workshop steps — any change to steps must be reflected in the README.
- All external links must include a QR code so developers can scan them on their devices.
- All referenced images must exist — no broken image links. Verify paths before committing.
