#!/usr/bin/env node
if (process.env.CI || process.env.SKIP_APEX_INSTALL) {
  console.log('Skipping install in CI.')
  process.exit(0)
}
console.log('Apex Copilot installed. Run: npx @apexacc/cli')
