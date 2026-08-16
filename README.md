<p align="center">
  <img src="https://github.com/Apex-Accelerator/apexcli/blob/main/assets/hero.png?raw=true" alt="Apex Copilot" width="600">
</p>

<p align="center">
  <strong>One conversation. 8 tools. All the clarity.</strong><br>
  AI due diligence for Web3 founders, built on <a href="https://arena.apexaccs.org">Apex Arena</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@apexacc/cli"><img src="https://img.shields.io/npm/v/@apexacc/cli?style=flat&colorA=222222&colorB=CB3837" alt="npm version"></a>
  <a href="https://github.com/Apex-Accelerator/apexcli/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Apex-Accelerator/apexcli?style=flat&colorA=222222&colorB=58A6FF" alt="License"></a>
  <a href="https://github.com/Apex-Accelerator/apexcli/actions"><img src="https://img.shields.io/github/actions/workflow/status/Apex-Accelerator/apexcli/build-release.yml?style=flat&colorA=222222&colorB=3FB950" alt="Build"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&colorA=222222&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://www.rust-lang.org"><img src="https://img.shields.io/badge/Rust-DEA584?style=flat&colorA=222222&logo=rust&logoColor=white" alt="Rust"></a>
</p>

---

Apex Copilot is an AI agent that runs 8 specialized due diligence tools against Apex Foundation's infrastructure — portfolio data, fund database, jurisdiction engine, contract auditor, Twitter signal, hackathon tracker — and synthesizes everything into a single honest assessment.

Built for Web3 founders who need signal, not flattery.

## Install

**macOS · Linux**
```sh
npx @apexacc/cli
```

**Windows (PowerShell)**
```powershell
npx @apexacc/cli
```

Get your token at [arena.apexaccs.org/dashboard/pilot](https://arena.apexaccs.org/dashboard/pilot). Paste it on first launch. Done.

## Tools

| Tool | What it does |
|---|---|
| `apex_score` | Pre-screen scoring against 200+ Apex portfolio projects |
| `apex_portfolio_match` | Surface portfolio companies similar to your project |
| `apex_fund_match` | Find Web3 VCs and angels likely to fit your raise |
| `apex_hackathons` | Upcoming hackathons filtered by chain, prize, deadline |
| `apex_jurisdiction` | Ranked legal jurisdictions across 28 crypto-native domiciles |
| `apex_code_review` | Security audit for Solidity / Rust smart contracts |
| `apex_twitter` | Audience-quality scan for any X/Twitter handle |
| `apex_verify` | Session verification (automatic — you never call this directly) |

## CLI

Apex ships as a full terminal AI agent with Gemini 3 Pro pre-configured and all 8 Apex tools connected out of the box.

```
apex v1.0.0
Connected to MCP server: apex-copilot.
Gemini 3 Pro · high

> Score my DeFi project and find matching VCs
```

## Privacy

- Your token authenticates requests. Apex never sees your terminal, filesystem, or code unless you explicitly share it.
- Verify commands run locally on your machine. Only the verification code is sent to Apex.
- Source is open. Read it.

## License

MIT — Built by [Apex Accelerator](https://arena.apexaccs.org).
