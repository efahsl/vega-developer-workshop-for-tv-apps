---
inclusion: always
---

# Agent Operating Rules

## Editing Rules

- When editing `.md` files, use `str_replace` with the smallest unique `old_str` possible. Never rewrite entire files or large sections — only touch the lines that need to change.
- Before including any CLI command in documentation, verify it is valid by running `<command> --help` or equivalent in the terminal. Do not invent commands.
