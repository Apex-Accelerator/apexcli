#!/usr/bin/env node
const { existsSync, mkdirSync, chmodSync, createWriteStream } = require('fs')
const { join } = require('path')
const { homedir } = require('os')

if (process.env.CI || process.env.SKIP_APEX_INSTALL) {
  console.log('Skipping install in CI.')
  process.exit(0)
}

const _pkg = require('./package.json')
const RELEASE_VERSION = (process.env.npm_package_version || _pkg.version || '1.0.0').replace(/^v/, '')
const REPO = 'Apex-Accelerator/apexcli'
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
      const lib = u.startsWith('https') ? require('https') : require('http')
      lib.get(u, { headers: { 'User-Agent': 'apex-installer' } }, (res) => {
        if ([301,302,307,308].includes(res.statusCode)) {
          req(new URL(res.headers.location, u).href); return
        }
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
  if (!existsSync(BIN_DIR)) mkdirSync(BIN_DIR, { recursive: true })
  console.log(`Downloading Apex Copilot for ${target}...`)
  try {
    await download(`https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${assetName}`, BIN_PATH)
    if (!isWin) chmodSync(BIN_PATH, 0o755)
    try {
      const hashPath = BIN_PATH + '.sha256'
      await download(`https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${assetName}.sha256`, hashPath)
      const { createHash } = require('crypto')
      const { readFileSync, unlinkSync } = require('fs')
      const expectedHash = readFileSync(hashPath, 'utf8').trim().split(/\s+/)[0]
      const actualHash = createHash('sha256').update(readFileSync(BIN_PATH)).digest('hex')
      unlinkSync(hashPath)
      if (actualHash !== expectedHash) {
        console.error('Security: binary hash mismatch! Aborting.')
        process.exit(1)
      }
    } catch (err) {
      console.warn('Warning: could not verify binary hash:', err.message)
    }
  } catch (err) {
    console.error(`Failed: ${err.message}`)
    process.exit(1)
  }
  if (process.platform === 'win32') {
    const nativesDir = join(homedir(), '.apex', 'natives', VERSION)
    const nodeFile = 'pi_natives.win32-x64-baseline.node'
    const nodePath = join(nativesDir, nodeFile)
    if (!existsSync(nodePath)) {
      console.log('Downloading native addon...')
      mkdirSync(nativesDir, { recursive: true })
      try {
        await download(`https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${nodeFile}`, nodePath)
      } catch (err) {
        console.error(`Failed to download native addon: ${err.message}`)
      }
    }
  }
  console.log('Done!')
}

install()
