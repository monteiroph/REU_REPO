#!/usr/bin/env node
/*
  Usage:
    GITHUB_TOKEN=ghp_xxx node tools/create-pr-from-local.js --repo owner/repo --branch fix/vite-lockfile-node20 --title "PR title" --body-file PR_FIX_VITE_7_3_0.md --files package-lock.json,.github/workflows/check-upgrade.yml --labels maintenance,security,dependencies

  Notes:
  - The script reads files from disk and uploads them to the target branch using the GitHub Contents API.
  - Requires Node 18+ (global fetch available) and a PAT with `repo` scope.
  - The token must be set in the environment as GITHUB_TOKEN. Do NOT commit the token.
*/

import fs from 'fs'
import path from 'path'
import process from 'process'

function usageAndExit(msg) {
  if (msg) console.error(msg)
  console.error('\nUsage:\n  GITHUB_TOKEN=ghp_xxx node tools/create-pr-from-local.js --repo owner/repo --branch branch-name --title "PR title" --body-file PR.md --files path1,path2 --labels label1,label2')
  process.exit(msg ? 1 : 0)
}

const argv = process.argv.slice(2)
const args = {}
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a.startsWith('--')) {
    const k = a.replace(/^--/, '')
    args[k] = argv[i + 1]
    i++
  }
}

if (!args.repo || !args.branch || !args.title || !args['body-file'] || !args.files) {
  usageAndExit('Missing required arguments')
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) usageAndExit('Set GITHUB_TOKEN in environment (PAT with repo scope)')

const [owner, repo] = args.repo.split('/')
if (!owner || !repo) usageAndExit('Invalid repo format; use owner/repo')

const branch = args.branch
const files = args.files.split(',').map(s => s.trim()).filter(Boolean)
const bodyFile = args['body-file']
const labels = (args.labels || '').split(',').map(s => s.trim()).filter(Boolean)
const title = args.title

const apiBase = 'https://api.github.com'

async function ghFetch(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'create-pr-from-local-script',
      'Accept': 'application/vnd.github+json',
      ...(opts.headers || {})
    }
  })
  if (!res.ok) {
    const text = await res.text()
    const err = new Error(`GitHub API error ${res.status} ${res.statusText}: ${text}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

async function main() {
  // 1) get main branch sha
  console.log('Fetching main branch SHA...')
  const mainRef = await ghFetch(`${apiBase}/repos/${owner}/${repo}/git/ref/heads/main`)
  const mainSha = mainRef.object.sha
  console.log('main SHA:', mainSha)

  // 2) create branch ref if not exists
  let branchExists = true
  try {
    await ghFetch(`${apiBase}/repos/${owner}/${repo}/git/ref/heads/${branch}`)
    console.log('Branch already exists:', branch)
  } catch (err) {
    if (err.status === 404) {
      branchExists = false
      console.log('Creating branch:', branch)
      await ghFetch(`${apiBase}/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: mainSha })
      })
      console.log('Branch created')
    } else {
      throw err
    }
  }

  // 3) create or update files on the branch
  for (const relPath of files) {
    const absPath = path.resolve(process.cwd(), relPath)
    if (!fs.existsSync(absPath)) {
      console.warn(`Warning: file not found locally: ${relPath}, skipping`)
      continue
    }
    const content = fs.readFileSync(absPath)
    const b64 = content.toString('base64')

    // check if file exists on branch to include sha for update
    let existingSha = null
    try {
      const info = await ghFetch(`${apiBase}/repos/${owner}/${repo}/contents/${encodeURIComponent(relPath)}?ref=${branch}`)
      existingSha = info.sha
      console.log(`Updating ${relPath} (sha ${existingSha})`)
    } catch (err) {
      if (err.status === 404) {
        console.log(`Creating ${relPath}`)
      } else {
        throw err
      }
    }

    const payload = {
      message: `chore: update ${relPath} (automated)`,
      content: b64,
      branch
    }
    if (existingSha) payload.sha = existingSha

    await ghFetch(`${apiBase}/repos/${owner}/${repo}/contents/${encodeURIComponent(relPath)}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    console.log(`Uploaded ${relPath}`)
  }

  // 4) create PR
  console.log('Reading PR body...')
  let body = ''
  try {
    body = fs.readFileSync(path.resolve(process.cwd(), bodyFile), 'utf8')
  } catch (err) {
    console.warn('PR body file not found, proceeding with empty body')
  }

  const prPayload = {
    title,
    head: branch,
    base: 'main',
    body
  }

  const pr = await ghFetch(`${apiBase}/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify(prPayload)
  })

  console.log('PR created:', pr.html_url)

  // 5) add labels if any
  if (labels.length > 0) {
    try {
      await ghFetch(`${apiBase}/repos/${owner}/${repo}/issues/${pr.number}/labels`, {
        method: 'POST',
        body: JSON.stringify({ labels })
      })
      console.log('Added labels:', labels.join(', '))
    } catch (err) {
      console.warn('Could not add labels:', err.message)
    }
  }

  console.log('\nDone. Please revoke the PAT when finished (https://github.com/settings/tokens)')
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exitCode = 1
})
