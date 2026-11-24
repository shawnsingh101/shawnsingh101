---
title: Git and GitHub
---
How changes get from an idea to the live app: commits, branches, pull requests, and the GitHub Actions robots that build and publish it.

## Saving history
- A saved snapshot of the project, with a message saying what changed, is a {{commit|what's it called?}}.
- Every commit gets a unique code, like `e793cc6`: its {{hash|what's it called?}}.
- The tool that keeps this history of versions is {{Git|which tool?}}; GitHub is a website that hosts it.

## Working side by side
- The official version of the project, the one that's live, is the {{`main`|which branch?}} branch.
- A parallel copy of the project where changes are made without touching main is a {{branch|what's it called?}}.
- Sending commits from a computer up to GitHub is a {{push|what's it called?}}.
- Bringing GitHub's latest version down to a computer is a {{pull|what's it called?}} (or a fetch).

## Bringing changes in
- A request to bring one branch's commits into main is a {{pull request|what's it called?}}.
- The pull request tab with removed lines in red and added lines in green is {{Files changed|which tab?}}.
- Clicking Merge on a pull request adds its commits to {{main|which branch?}}.

## GitHub Actions
- Each robot's instructions are a YAML file in {{`.github/workflows`|which folder?}}.
- The nightly sync's schedule. `cron: '17 7 * * *'` means every day at {{7:17|what time?}} UTC.
```yaml
on:
  schedule:
    - cron: '17 7 * * *'
  workflow_dispatch:
```
source: .github/workflows/geo-quest-sync.yml
> A cron line reads minute, hour, day of month, month, day of week; * means "every".
- In the same workflow, the line {{`workflow_dispatch:`|which line?}} adds the Run workflow button.
- The deploy robot runs whenever a commit on main changes something in this {{folder|what?}}, `geo-quest/**`.
```yaml
on:
  push:
    branches: [main]
    paths: ['geo-quest/**', '.github/workflows/geo-quest-pages.yml']
```
source: .github/workflows/geo-quest-pages.yml
- A red ✗ on a run means a {{step failed|what happened?}}: open it to see which one, and why.
- A fix in `collection-fixes.json` shows up only after the {{data sync|which robot?}} rebuilds the generated data; the deploy alone just republishes the old data.
