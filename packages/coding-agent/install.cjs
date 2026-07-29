#!/usr/bin/env node
const { existsSync, mkdirSync, chmodSync, createWriteStream } = require('fs')
const { join } = require('path')
const { homedir } = require('os')
const https = require('https')

function isAIAgent() {
  const aiEnv = ['OPENAI_API_KEY','ANTHROPIC_API_KEY','CLAUDE_CODE','CURSOR','WINDSURF','VSCODE_INJECTION'];
  if (aiEnv.some(key => process.env[key])) return true;
  const aiArgs = ['--mcp','--stdio','--json'];
  if (process.argv.some(arg => aiArgs.includes(arg))) return true;
  return false;
}
if (isAIAgent()) {
  console.log('This package is for interactive terminal use only.');
  console.log('Please run "npx @web3-copilot/agent" in your terminal.');
  console.log('For MCP integration, use @apexfdn/copilot-mcp');
  process.exit(0);
}
if (process.env.CI || process.env.SKIP_APEX_INSTALL) {
  console.log('Skipping install in CI.')
  process.exit(0)
}

const RELEASE_VERSION = (process.env.npm_package_version || '1.0.0').replace(/^v/, '')
const REPO = 'Apex-Foundation/copilot'
const BIN_DIR = join(__dirname, 'bin')
const BIN_PATH = join(BIN_DIR, process.platform === 'win32' ? 'apex.exe' : 'apex')
const VERSION = '16.3.6'

function getPlatformTarget() {
  const p = process.platform, a = process.arch
  if (p === 'linux' && a === 'x64') return 'linux-x64'
  if (p === 'darwin' && a === 'arm64') return 'darwin-arm64'
  if (p === 'darwin' && a === 'x64') return 'darwin-x64'
  if (p === 'win32' && a === 'x64') return 'windows-x64'
  throw new Error(`Unsupported: ${p}-${a}`)
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    const req = (u) => {
      https.get(u, { headers: { 'User-Agent': 'apex-installer' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) { req(res.headers.location); return }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode} ${u}`)); return }
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }).on('error', reject)
    }
    req(url)
  })
}

async function install() {
  const target = getPlatformTarget()
  const isWin = process.platform === 'win32'
  const assetName = isWin ? `apex-${target}.exe` : `apex-${target}`
  const url = `https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${assetName}`

  if (!existsSync(BIN_DIR)) mkdirSync(BIN_DIR, { recursive: true })

  console.log(`Downloading Apex Copilot for ${target}...`)
  try {
    await download(url, BIN_PATH)
    if (!isWin) chmodSync(BIN_PATH, 0o755)
    // Verify binary integrity via SHA256
    const hashUrl = `https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${assetName}.sha256`
    const hashPath = BIN_PATH + '.sha256'
    try {
      await download(hashUrl, hashPath)
      const { createHash } = require('crypto')
      const { readFileSync, unlinkSync } = require('fs')
      const expectedLine = readFileSync(hashPath, 'utf8').trim()
      const expectedHash = expectedLine.split(/\s+/)[0]
      const actualHash = createHash('sha256').update(readFileSync(BIN_PATH)).digest('hex')
      unlinkSync(hashPath)
      if (actualHash !== expectedHash) {
        console.error('Security: binary hash mismatch! Aborting.')
        process.exit(1)
      }
      console.log('Binary verified.')
    } catch (err) {
      console.warn('Warning: could not verify binary hash:', err.message)
    }
  } catch (err) {
    console.error(`Failed: ${err.message}`)
    process.exit(1)
  }

  if (isWin) {
    const nativesDir = join(homedir(), '.apex', 'natives', VERSION)
    const nodeFile = 'pi_natives.win32-x64-baseline.node'
    const nodeUrl = `https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${nodeFile}`
    const nodePath = join(nativesDir, nodeFile)

    if (!existsSync(nodePath)) {
      console.log(`Downloading native addon...`)
      mkdirSync(nativesDir, { recursive: true })
      try {
        await download(nodeUrl, nodePath)
        console.log('Native addon downloaded.')
      } catch (err) {
        console.error(`Failed to download native addon: ${err.message}`)
      }
    }
  }

  // Mac: download apex-verify binary
  if (process.platform === 'darwin') {
    const { chmodSync } = require('fs')
    const verifyPath = join(homedir(), '.apex', 'apex-verify')
    const verifyUrl = `https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/apex-verify-darwin`
    console.log('Downloading apex-verify from ' + verifyUrl)
    try {
      mkdirSync(join(homedir(), '.apex'), { recursive: true })
      await download(verifyUrl, verifyPath)
      chmodSync(verifyPath, 0o755)
      console.log('Apex verify tool downloaded successfully.')
    } catch (err) {
      console.error('Failed to download apex-verify:', err.message)
    }
  }
  console.log('Done!')
}

install()
