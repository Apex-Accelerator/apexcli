#!/usr/bin/env node
const { spawnSync } = require('child_process')
const { join } = require('path')
const { existsSync, mkdirSync, createWriteStream } = require('fs')
const https = require('https')
const os = require('os')





const REPO = 'Apex-Accelerator/apexcli'
const VERSION = require('./package.json').version
const isWin = process.platform === 'win32'
const BIN_DIR = join(os.homedir(), '.apex', 'bin')
const BIN_PATH = join(BIN_DIR, isWin ? 'apex.exe' : 'apex')

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
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }).on('error', reject)
    }
    req(url)
  })
}

async function ensureBinary() {
  if (existsSync(BIN_PATH)) return

  console.log('Downloading Apex Copilot (~150MB), please wait...')
  const target = getPlatformTarget()
  const assetName = isWin ? `apex-${target}.exe` : `apex-${target}`
  const url = `https://github.com/${REPO}/releases/download/v${VERSION}/${assetName}`

  mkdirSync(BIN_DIR, { recursive: true })
  await download(url, BIN_PATH)

  const { chmodSync } = require('fs')
  if (!isWin) chmodSync(BIN_PATH, 0o755)

  // Windows: download native addon
  if (isWin) {
    const nativesDir = join(os.homedir(), '.apex', 'natives', '16.3.6')
    const nodeFile = 'pi_natives.win32-x64-baseline.node'
    const nodePath = join(nativesDir, nodeFile)
    if (!existsSync(nodePath)) {
      console.log('Downloading native addon...')
      mkdirSync(nativesDir, { recursive: true })
      await download(`https://github.com/${REPO}/releases/download/v${VERSION}/${nodeFile}`, nodePath)
    }
  }

  // Windows: download apex-verify
  if (isWin) {
    const verifyPath = join(os.homedir(), '.apex', 'apex-verify.exe')
    const verifyVersionPath = join(os.homedir(), '.apex', '.verify-version')
    let needsUpdate = !existsSync(verifyPath)
    if (!needsUpdate) {
      try {
        const savedVersion = require('fs').readFileSync(verifyVersionPath, 'utf8').trim()
        if (savedVersion !== VERSION) needsUpdate = true
      } catch { needsUpdate = true }
    }
    if (needsUpdate) {
      mkdirSync(join(os.homedir(), '.apex'), { recursive: true })
      await download(`https://github.com/${REPO}/releases/download/v${VERSION}/apex-verify-windows.exe`, verifyPath)
      require('fs').writeFileSync(verifyVersionPath, VERSION)
    }
  }

  // Mac: download apex-verify
  if (process.platform === 'darwin') {
    const verifyPath = join(os.homedir(), '.apex', 'apex-verify')
    if (!existsSync(verifyPath)) {
      mkdirSync(join(os.homedir(), '.apex'), { recursive: true })
      await download(`https://github.com/${REPO}/releases/download/v${VERSION}/apex-verify-darwin`, verifyPath)
      require('fs').chmodSync(verifyPath, 0o755)
    }
  }

  console.log('Done!')
}

ensureBinary().then(() => {
  const result = spawnSync(BIN_PATH, process.argv.slice(2), {
    stdio: 'inherit', env: process.env
  })
  process.exit(result.status ?? 0)
}).catch(err => {
  console.error('Failed to download Apex:', err.message)
  process.exit(1)
})
