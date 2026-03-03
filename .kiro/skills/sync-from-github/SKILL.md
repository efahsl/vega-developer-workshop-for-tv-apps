---
name: sync-from-github
description: Sync changes from the public GitHub repo back into the internal Amazon repo. Use when pulling external contributions, PR merges, or community changes back into the internal codebase.
---

# Sync from GitHub

Pull changes from the public GitHub repo into the internal Amazon repo.

## Setup (one-time)

### 1. Add the GitHub remote

Check if the `github` remote exists:

```bash
git remote -v | grep github
```

If no output, add it:

```bash
git remote add github https://github.com/efahsl/vega-developer-workshop-for-tv-apps.git
```

### 2. Authenticate with GitHub

Check if credentials are already stored:

```bash
git config --global credential.helper
```

If not `osxkeychain`, enable it:

```bash
git config --global credential.helper osxkeychain
```

Then store your GitHub PAT. Ask the user for their GitHub username, then instruct them to:

1. Generate a PAT at https://github.com/settings/tokens (select `repo` scope)
2. Store it by running this in their terminal (replacing placeholders):
   ```bash
   git credential-osxkeychain store <<EOF
   protocol=https
   host=github.com
   username=<GITHUB_USERNAME>
   password=<PASTE_TOKEN_HERE>
   EOF
   ```

⚠️ NEVER accept or store tokens directly — always instruct the user to run the command themselves.

## Sync Steps

1. Note the current branch and ensure it's clean:
   ```bash
   SYNC_BRANCH=$(git branch --show-current)
   echo "Current branch: $SYNC_BRANCH"
   git status
   ```
   If there are uncommitted changes, commit or stash them before proceeding.

2. Fetch the latest from GitHub:
   ```bash
   git fetch github $SYNC_BRANCH
   ```

3. Preview what changed on GitHub since the last sync:
   ```bash
   git -P log --oneline $SYNC_BRANCH..github/$SYNC_BRANCH
   git -P diff --stat $SYNC_BRANCH..github/$SYNC_BRANCH
   ```
   Show the user the list of changed files and commits. Ask if they want to proceed.

4. Merge the GitHub changes into the local branch:
   ```bash
   git merge github/$SYNC_BRANCH --no-edit
   ```

   If there are merge conflicts:
   - List the conflicted files with `git diff --name-only --diff-filter=U`
   - Help the user resolve each conflict
   - After resolving, `git add` the resolved files and `git commit`

5. Check if the merge introduced any `.kiro/` or `AGENTS.md` deletions (GitHub doesn't have these files, so a merge could remove them):
   ```bash
   git -P diff HEAD~1 --name-only --diff-filter=D | grep -E '\.kiro/|AGENTS\.md'
   ```
   If any are listed, restore them:
   ```bash
   git checkout HEAD~1 -- .kiro/ AGENTS.md
   git commit -m "Restore internal-only files after GitHub sync"
   ```

6. Verify the build still works:
   ```bash
   # Run any applicable build/lint checks for the repo
   ```

7. The changes are now in the local branch. Remind the user to create a CR if needed to get the changes reviewed before they land in the internal repo.

## Important

- This pulls changes INTO the internal repo — it does NOT push anything.
- `.kiro/` and `AGENTS.md` are internal-only and should never be deleted by a GitHub sync.
- The internal repo (`origin`) is `ssh://git.amazon.com/pkg/VegaDeveloperWorkshop`. The GitHub repo (`github`) is `https://github.com/efahsl/vega-developer-workshop-for-tv-apps`.
