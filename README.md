# Quiet Machines exit guide for AI agents

Ask your AI what you can replace a paid app with, or let it find the paid subscriptions on your Mac,
and get sourced free, included, buy-once and self-hosted alternatives from
[the exit guide](https://quietmachines.fyi/guide): real prices, each option's catch, and switching steps.
Works in Claude Code, Codex, the Claude app, ChatGPT, Cursor, VS Code and any MCP client.

- **MCP server:** `https://quietmachines.fyi/mcp` (Streamable HTTP, read-only, no account)
- **Skill:** `skills/subscription-exit`: one app → alternatives, or the full scan → confirm → exit plan
- **Privacy:** the scan runs on your Mac and prints only matches. Your app list never leaves your Mac;
  the server only sees the app names you ask about or confirm. [Privacy policy](https://quietmachines.fyi/privacy)

Setup for every client, with copy buttons: **https://quietmachines.fyi/guide#agents**

## Claude Code

```bash
claude plugin marketplace add rohitvpgawli/quietmachines-exit-guide
claude plugin install exit-guide@quietmachines
```

Or just the MCP server: `claude mcp add --transport http exit-guide https://quietmachines.fyi/mcp`

## Codex (CLI and app)

```bash
codex plugin marketplace add rohitvpgawli/quietmachines-exit-guide
codex plugin add exit-guide@quietmachines
```

The plugin adds the skill and loads the tools in every chat. If you add the server yourself, include
`omit_tools_from`, or Codex keeps the tools hidden until you name them:

```toml
[mcp_servers.exit-guide]
url = "https://quietmachines.fyi/mcp"
omit_tools_from = ["deferred"]
```

## Then

**Start a new chat** (tools load when a session starts) and ask:

- *"What can I replace Wispr Flow with?"*
- *"Which of my subscriptions can I replace with something I pay for once?"*

You should see a `find_alternatives` call from exit-guide. If your AI searches the web instead,
the tools aren't loaded in that chat.

## Any other MCP client

Point it at `https://quietmachines.fyi/mcp`. The server also offers a `subscription_exit_plan`
prompt with the full-scan workflow, so clients without skills still get it.

| Tool | What it does |
|---|---|
| `find_alternatives` | Alternatives to one or more apps by name, typos fine ("wisperflow", "adobe cc") |
| `search_alternatives` | Search by task or keyword (e.g. "PDF", "dictation") |
| `list_subscriptions` | Every paid app in the guide, its plan, yearly price where sourced, and its alternatives |
| `get_detection_index` | App names, bundle ids, Homebrew casks, extensions and domains for local matching |
| `get_alternatives` | Full entries for confirmed ids: alternatives, costs, the catch, switching steps, sources |
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
