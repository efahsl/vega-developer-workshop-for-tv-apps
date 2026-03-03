---
name: sync-to-github
description: Sync the current branch from the internal Amazon repo to the public GitHub repo. Use when pushing workshop content to GitHub, syncing branches, or publishing updates to the external repo.
---

# Sync to GitHub

Sync the current branch from the internal Amazon repo to the public GitHub repo.

## Setup (one-time)

Check if the `github` remote exists:

```bash
git remote -v | grep github
```

If no output, add it:

```bash
git remote add github https://github.com/efahsl/vega-developer-workshop-for-tv-apps.git
```

## Sync Steps

1. Note the current branch name (this will be the target branch on GitHub):
   ```bash
   SYNC_BRANCH=$(git branch --show-current)
   echo "Will sync to github branch: $SYNC_BRANCH"
   ```

2. Verify there are no uncommitted changes:
   ```bash
   git status
   ```

3. Review the git author that will appear on the public commit:
   ```bash
   echo "Git author: $(git config user.name) <$(git config user.email)>"
   ```
   ⚠️ If this is an internal email (e.g. `@amazon.com`), change it before proceeding:
   ```bash
   git config user.name "Your Public Name"
   git config user.email "your-public-email@example.com"
   ```
   Remember to revert after syncing if needed.

4. Create a temporary orphan branch with a single squashed commit to avoid leaking internal commit history:
   ```bash
   git checkout --orphan temp-sync
   git reset HEAD -- .kiro/ AGENTS.md
   git rm -rf --cached .kiro/ AGENTS.md 2>/dev/null || true
   git add -A
   git commit -m "<descriptive message about the update>"
   ```

5. Review for internal references before pushing:
   ```bash
   grep -r "@amazon.com" --include="*.md" --include="*.json" --include="*.ts" --include="*.js" .
   ```
   If any results appear, remove or replace them before proceeding.

6. Push the squashed commit to a sync branch on GitHub:
   ```bash
   git push github temp-sync:sync/$SYNC_BRANCH --force
   ```

7. Open a PR on GitHub from `sync/$SYNC_BRANCH` → `$SYNC_BRANCH`:
   ```bash
   echo "Create PR: https://github.com/efahsl/vega-developer-workshop-for-tv-apps/compare/$SYNC_BRANCH...sync/$SYNC_BRANCH"
   ```
   Open the printed URL in a browser to create the PR. Add a reviewer before merging.

8. Switch back to the original branch and clean up:
   ```bash
   git checkout $SYNC_BRANCH
   git branch -D temp-sync
   ```

## Important

- Only push when the workshop steps are finalized and reviewed.
- Do NOT push `.kiro/` or `AGENTS.md` — these are local-only. Verify with `git status` that they are untracked before pushing.
- The internal repo (`origin`) is `ssh://git.amazon.com/pkg/VegaDeveloperWorkshop`. The GitHub repo (`github`) is `https://github.com/efahsl/vega-developer-workshop-for-tv-apps`.
