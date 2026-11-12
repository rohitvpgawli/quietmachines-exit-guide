# Quiet Machines exit guide for AI agents

Find the paid subscriptions on your Mac and get sourced free, included, buy-once and self-hosted
alternatives, from [the exit guide](https://quietmachines.fyi/guide), inside Claude Code, Codex,
or any MCP client.

- **MCP server:** `https://quietmachines.fyi/mcp` (Streamable HTTP, read-only, no account)
- **Skill:** `skills/subscription-exit`: scan → confirm → alternatives → yearly total and exit receipt
- **Privacy:** the scan runs on your Mac and prints only matches. Your app list never leaves your Mac;
  the server only sees the ids of subscriptions you confirm. [Privacy policy](https://quietmachines.fyi/privacy)

## Claude Code

Add the marketplace and install the plugin (MCP server + skill):

```bash
claude plugin marketplace add rohitvpgawli/quietmachines-exit-guide
claude plugin install exit-guide@quietmachines
```

Or just the MCP server:

```bash
claude mcp add --transport http exit-guide https://quietmachines.fyi/mcp
```

Then ask: *"Which of my subscriptions can I replace with something I pay for once?"*

## Codex

```bash
codex mcp add exit-guide --url https://quietmachines.fyi/mcp
git clone https://github.com/rohitvpgawli/quietmachines-exit-guide
mkdir -p ~/.codex/skills && cp -R quietmachines-exit-guide/skills/subscription-exit ~/.codex/skills/
```

## Any other MCP client

Point it at `https://quietmachines.fyi/mcp`. The server also offers a `subscription_exit_plan`
prompt with the same workflow as the skill, so clients without skills still get the full flow.

| Tool | What it does |
|---|---|
| `list_subscriptions` | Every paid app in the guide, its plan, yearly price where sourced, and its alternatives |
| `get_detection_index` | App names, bundle ids, Homebrew casks, extensions and domains for local matching |
| `get_alternatives` | Full entries for confirmed ids: alternatives, costs, the catch, switching steps, sources |
| `search_alternatives` | Search by app, alternative or task (e.g. "PDF", "dictation") |
| `estimate_savings` | Yearly total of sourced prices and a link to the printable exit receipt |

The detection index is also plain JSON at `https://quietmachines.fyi/api/exit-guide/detect.json`.

## The scan

```bash
osascript -l JavaScript skills/subscription-exit/scripts/scan.js
```

JavaScript for Automation, built into macOS: no installs. Read-only. It checks app bundles in
/Applications and ~/Applications, `brew list --cask`, and VS Code/Cursor extension folders.
It does not read browser history, email, keychains, documents or bank data.
Installed does not mean paid: the skill always asks before counting anything.

## Data

Served from the same data file as the guide pages, so the MCP and quietmachines.fyi/guide always agree.
This repository is published from the Quiet Machines studio repo; open issues here.
Prices are USD list prices from vendors' official pages, with a research date per entry.
Alternatives made by Quiet Machines are flagged `ours: true`.

## License

MIT. See [LICENSE](LICENSE).
