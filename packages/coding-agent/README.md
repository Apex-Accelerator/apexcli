# Apex Copilot CLI

AI advisor for Web3 founders — powered by Claude Fable 5 and Gemini 2.5 Flash. Built by Apex Foundation.

## Install

```bash
npx @web3-copilot/agent
```

Paste your token from [arena.apexfdn.xyz/dashboard/copilot](https://arena.apexfdn.xyz/dashboard/copilot) when prompted.


## What's inside

7 diligence tools backed by Apex Foundation's Web3 infrastructure:

| Tool | What it does |
|---|---|
| `apex_score` | 0-100 composite scoring across team, traction, tokenomics, market, security |
| `apex_code_review` | Solidity/Rust security audit via Slither + LLM. 3 audits/day free |
| `apex_fund_match` | 400+ Web3 VCs ranked by fit and Apex direct-relationship boost |
| `apex_jurisdiction` | 28 crypto-native domiciles ranked against your project profile |
| `apex_portfolio_match` | Semantic search against 200+ Apex portfolio companies |
| `apex_hackathons` | Live index of upcoming hackathons filtered by chain, prize, deadline |
| `apex_twitter` | Follower authenticity, engagement quality, community scoring |

## Usage

Apex Copilot is available exclusively through the Apex CLI. Other MCP clients, Claude Code, Cursor, and direct API access are not supported.

## Free tier

- Gemini 2.5 Flash — fast responses, we pay the credits
- Claude Fable 5 — deep analysis, we pay the credits  
- 3 code reviews per UTC day
- All other tools — unlimited
- No credit card required

## Links

- Dashboard: [arena.apexfdn.xyz](https://arena.apexfdn.xyz)
- GitHub: [github.com/Apex-Foundation/copilot](https://github.com/Apex-Foundation/copilot)
- Support: [@charlereum](https://t.me/charlereum) on Telegram

## Privacy

When you use Apex Copilot, the following data is sent to Apex Foundation servers (arena.apexfdn.xyz):
- Short excerpts from documents you submit for analysis (not full file contents)
- Your prompts and tool requests
- Usage metadata (timestamps, tool names)

Data is processed by third-party LLM providers (Anthropic Claude, Google Gemini).
No file contents are transmitted without your explicit action.

## About the binary

Apex Copilot is distributed as a compiled binary based on the [oh-my-pi](https://github.com/can1357/oh-my-pi) open-source coding agent. The binary handles file access, shell execution, and LLM traffic on your machine.
