// Copies shared/validation.js into the client and server source trees.
// The copies are committed so each deploy builds from its own folder.
// Run with --check in CI to fail if a copy has drifted from the source.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'shared', 'validation.js'), 'utf8')
const header = '// Generated from shared/validation.js by shared/sync.mjs. Edit the source instead.\n'
const targets = [
  join(root, 'client', 'src', 'shared', 'validation.js'),
  join(root, 'server', 'shared', 'validation.js'),
]
const expected = header + source

if (process.argv.includes('--check')) {
  const stale = targets.filter((file) => {
    try {
      return readFileSync(file, 'utf8') !== expected
    } catch {
      return true
    }
  })
  if (stale.length > 0) {
    console.error('Shared validation copies are out of date. Run: node shared/sync.mjs')
    stale.forEach((file) => console.error(' - ' + file))
    process.exit(1)
  }
  console.log('Shared validation copies are up to date.')
} else {
  for (const file of targets) {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, expected)
  }
  console.log('Synced shared validation into client and server.')
}
