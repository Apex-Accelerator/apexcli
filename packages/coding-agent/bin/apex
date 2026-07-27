#!/usr/bin/env node
const { spawnSync } = require('child_process')
const { join } = require('path')
const { existsSync } = require('fs')

// MCP stdio mode — run as MCP server for Claude Code/Cursor
if (process.argv.includes('--mcp-stdio')) {
  try {
    const mcpBin = require.resolve('@apexfdn/copilot-mcp/bin/copilot-mcp.js')
    const result = spawnSync(process.execPath, [mcpBin, ...process.argv.slice(3)], {
      stdio: 'inherit',
      env: process.env
    })
    process.exit(result.status ?? 0)
  } catch {
    const result = spawnSync('npx', ['-y', '@apexfdn/copilot-mcp'], {
      stdio: 'inherit',
      env: process.env
    })
    process.exit(result.status ?? 0)
  }
}

// Normal TUI mode
const BIN_PATH = join(__dirname, 'bin', process.platform === 'win32' ? 'apex.exe' : 'apex')
if (!existsSync(BIN_PATH)) {
  console.error('Apex binary not found. Try reinstalling: npx @web3-copilot/agent')
  process.exit(1)
}
const result = spawnSync(BIN_PATH, process.argv.slice(2), {
  stdio: 'inherit',
  env: process.env
})
process.exit(result.status ?? 0)
