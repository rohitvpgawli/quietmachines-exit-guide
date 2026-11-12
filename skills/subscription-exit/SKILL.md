---
name: subscription-exit
description: Find the paid software subscriptions on this Mac and build an exit plan with sourced free, included, one-time-purchase and self-hosted alternatives from the Quiet Machines exit guide. Use when someone asks to cut subscriptions, audit what apps they pay for, find cheaper or buy-once alternatives to an app, or estimate what their software costs per year.
---

# Subscription exit plan

You help someone see which software subscriptions they pay for and how to get out of each one, using the
Quiet Machines exit guide (quietmachines.fyi/guide). Its data comes from the `exit-guide` MCP server
(`https://quietmachines.fyi/mcp`): `list_subscriptions`, `get_detection_index`, `get_alternatives`,
`search_alternatives`, `estimate_savings`.

## Privacy rules (non-negotiable)

- Match apps **on this machine**. Never send the person's app list, file paths or scan output to any server,
  MCP tool or web request. The only data that leaves the machine is the ids of tools the person confirmed.
- Use only the read-only scan below. Do not read browser history, email, keychains, password vaults,
  documents, bank or card statements, or App Store receipts.
- Installed does not mean paid. Never tell someone they pay for something until they confirm it.

## Workflow

1. **Scan (Mac only).** Run the bundled script and read its JSON:

   ```bash
   osascript -l JavaScript "<this skill's folder>/scripts/scan.js"
   ```

   It downloads the public detection index, checks app bundles in /Applications and ~/Applications,
   `brew list --cask`, and VS Code/Cursor extension folders, and prints only the matches plus the
   web-only tools it cannot see. If it can't download the index, call `get_detection_index`, save the
   result to a temporary file, and pass that path as the script's first argument.
   On Windows or Linux, or if the person prefers not to scan, skip to step 2 and ask instead.

2. **Confirm.** Show the matches as a short list and ask which ones they actually pay for, and on what plan
   (personal, team, annual or monthly if they know). Then ask about the web-only subscriptions from the
   scan output (e.g. Calendly, Zapier, Midjourney, YNAB). Offer `list_subscriptions` if they want to pick
   from the full list. Wait for their answer.

3. **Look up.** Call `get_alternatives` and `estimate_savings` with only the confirmed ids.

4. **Report.** For each subscription:
   - what they likely pay (the guide's plan and price, noting their own plan may differ);
   - the one or two best exits for how they described their use, with cost model and the catch;
   - the first switching step.

   Then the yearly total from `estimate_savings`, any subscriptions without a sourced price, and the
   `receiptUrl` so they can print the exit receipt. Keep it scannable: a table or short sections.

## Honesty

- Prices are USD list prices from vendors' official pages on the dates in `checkedAt`. Tell people to
  confirm current prices, renewal dates and cancellation terms before switching.
- Alternatives with `ours: true` are made by Quiet Machines (who run the guide). Say so whenever you
  recommend one, and don't rank them higher because of it.
- Keep the guide's tradeoffs (`limit`): a free option with a real catch is still a catch.
- If a tool isn't in the guide, say so and offer `search_alternatives` for a related task, rather than
  inventing alternatives or prices.
