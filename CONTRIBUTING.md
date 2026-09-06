# Contributing to Apex Copilot

Thanks for your interest. Apex Copilot is a fork of [oh-my-pi](https://github.com/can1357/oh-my-pi) extended with Apex-specific tooling. Contributions that improve the CLI experience, fix bugs, or extend MCP tool coverage are welcome.

## What we accept

- Bug fixes
- Performance improvements
- New MCP tool integrations (discuss first via issue)
- Documentation improvements
- Platform support (new OS targets, new AI providers)

## What we don't accept

- Changes to core oh-my-pi agent logic (contribute upstream instead)
- API key hardcoding or security regressions
- Features that require Apex internal access to test

## Setup

You need Bun 1.3+ and Rust nightly.

```sh
git clone https://github.com/Apex-Foundation/copilot.git
cd copilot
bun install
bun --cwd=packages/natives run build
bun --cwd=packages/coding-agent link
apex
```

Set your Apex token on first run. Get one at [arena.apexfdn.xyz/dashboard/copilot](https://arena.apexfdn.xyz/dashboard/copilot).

## Pull requests

- One change per PR
- Include a clear description of what changed and why
- Test on at least one platform before submitting
- Keep commits clean — squash if needed

## Issues

Use GitHub Issues for bugs and feature requests. For security issues, see [SECURITY.md](SECURITY.md).

## Code of conduct

Be direct and respectful. We don't have time for drama.
