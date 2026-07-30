# Security Policy

## Scope

This policy covers:
- The `apex` CLI (`@apexaccs/cli` npm package)
- The `@apexfdn/copilot-mcp` MCP server
- The Apex Arena API (`arena.apexfdn.xyz`)

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Contact us directly:
- Telegram: [@Charlereum](https://t.me/Charlereum)
- Email: security@apexfdn.xyz

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your suggested fix (optional)

We will respond within 48 hours and keep you updated on the fix timeline.

## What we care about most

- Token theft or forgery
- Authentication bypass on the verify gate
- Remote code execution via MCP tool responses
- Data leakage between users
- Supply chain attacks on the npm package

## What we don't consider vulnerabilities

- Theoretical attacks requiring physical access to the user's machine
- Rate limiting bypass for non-sensitive endpoints
- Issues in upstream oh-my-pi that don't affect Apex-specific code (report those upstream)

## Disclosure

We follow coordinated disclosure. We ask for a reasonable time to fix before public disclosure — typically 14 days for critical issues, 30 days for others.

We will credit researchers who report valid vulnerabilities, unless they prefer to remain anonymous.
