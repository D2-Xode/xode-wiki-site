// One-time import of the XODE wiki's Google Drive export (the ../xode-wiki folder)
// into docs/. Re-running it overwrites the imported pages, so only do that if you
// want to throw away edits made on the site since.
//
// Usage: node scripts/import-drive-export.mjs [path-to-export]
//
// Google Docs' Markdown export needs some cleanup to read well on the site:
// - base64 images are written out as PNG files in an images/ folder next to the page
// - "$ command" paragraphs, shell scripts, config snippets and one-cell tables
//   become code blocks
// - the Google Docs table of contents and {#custom-anchor} heading ids are dropped
//   (VitePress builds its own "On this page" outline)
// - headings are shifted so each page's top-level sections are <h2>
// - links to pages on the old wiki.xode.net point at the new pages

import fs from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(process.argv[2] ?? '../xode-wiki')
const OUT = path.resolve('docs')

// Google Doc ID -> page title, for rewriting links to the old wiki.
const DOC_IDS = {
  '1-t_tn665WK341JCEhImWkpzXnhbq1Hed8MSCksEibyM': "Let's get started",
  '1GRKFVoxUxGWHi8k2IEab72UKAM6USNJh-sqINPDGxkI': 'Polkadot Ecosystem',
  '1szCtaZbFAyJwhc8IGLrZhfRnADXZmK8aMxlsW41DZjA': 'Web3',
  '1sNm5lmOVbj6I6BtJDF0sxo6Ko2V46E2SVRoX9qR4zYQ': 'XODE Blockchain',
  '1w1op4Mczwu6yDwOhJLcZ0-OaU698AyNl1oN_HZloEPs': 'XODE Governance',
  '11d4zRkfttxAYslhtw_KYuMqC7MPb6Jfmf6AebnUs3wI': 'Compiling XODE',
  '1Cw6d0gBFsnlfHabmMQCMfOydrYivfNlQYjoU1Esnk1g': 'Runtime Upgrade',
  '1mcT3wXrFokrJ3XGerm8zkHq9KpO_YW6xNf9ueJNNvRg': 'XODE Network',
  '1it-qnmkhAO-aDiNsh3f8jZRCHWEv8zKPwe-DeyfnMQg': 'XODE Node',
  '1kWGdbgYQOk0LLZnEuDHZ6BQvMm73n6vqpXejLEZkkeQ': 'XODE Node (Kusama 3344)',
  '1WwBLI00nnQu8IDGQ8EiPRcVJ0PfXElBzTpyazBc4RtA': 'XODE Staking',
  '18pdu5dzeRZnbqX-qTInwKK-Yj6PqrqlQvyjZOKbmH94': 'XODE Transaction Fees',
  '1bvAoWjHjLd9QgtmnBiY7jj1fA2Hw-upPOGgbXlV-tX0': 'Block Verification',
  '1SnXpvUkZx4Y6OvW47KD8qjiW_5X5XnvixRKHIJnix6Y': 'Security Mechanism',
  '1mth3xJhr6iqEBtmHWWnG8hdzj7VD9wc83s2pwnPWnJA': 'EVM Smart Contract',
  '1G-ekjk-oE3iyjuDXFTMlp4PFe2ROsKhi8BFPz713Vd0': 'WASM Smart Contract',
  '1A-lmbc6PY3eV302sd7wHPlxDjOo-7XoyKklq8Fcnymo': 'Xterium Wallet (Beta)',
  '18Du-oKCHzxTQZnAeKEq02RXWy2dE6qpAhgeDBFE1jQw': 'Other Assets',
  '1YOGj63VMjNRUtZ6tLeBNSPpnam36yJG1FXkzrS5fRpE': 'Tokenomics',
  '1gcFIvd2zd_UPczJk2FrtLiAr8pV1OC7PnXmTQm3KmDE': 'XON Utility Token',
}

const slugify = (s) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const stripOrder = (name) => name.replace(/^\d+\s+/, '')

// The export backslash-escapes almost every punctuation mark; code needs them undone.
const unescapeMd = (s) => s.replace(/\\([!-\/:-@\[-`{-~])/g, '$1')
const stripBold = (s) => s.replace(/(?<!\\)\*\*/g, '')

// A line of exported prose -> a line of code.
function toCode(line) {
  const s = line
    .replace(/(?<!\\)\*+/g, '') // bold/italic markers (literal asterisks are escaped)
    .replace(/(?<!\\)\[([^\]]*)\]\([^)]*\)/g, '$1') // auto-linked URLs
  return unescapeMd(s)
    .replace(/[“”]/g, '"') // Google Docs autocorrect: smart quotes...
    .replace(/[‘’]/g, "'")
    .replace(/(^|\s)[–—](?=[A-Za-z])/g, '$1--') // ...and "--" turned into a dash
    .trimEnd()
}

const isCommand = (t) => /^(\*\*)?\\?\$\s+\S/.test(t)
const stripPrompt = (code) => code.replace(/^\$\s+/, '')

// Google Docs joins the lines of a table cell with spaces, but the indentation survives
// (as tabs or runs of spaces), which is enough to put the line breaks back.
function unflatten(code) {
  if (!/\t| {4}/.test(code)) return [code]
  return code
    .replace(/^(#\[[^\]]*\])\s+/, '$1\n') // leading attribute
    .replace(/ {4,}/g, (m) => '\n' + m)
    .replace(/ ?\t/g, '\n    ')
    .replace(/(\S) (\};?)$/, '$1\n$2') // closing brace of the outermost block
    .split('\n')
    .map((l) => l.trimEnd())
}

function codeLang(lines, kind) {
  const code = lines.join('\n')
  if (kind === 'ini') return 'ini'
  if (/#\[|\bpub (const|fn|struct)\b/.test(code)) return 'rust'
  if (lines.length === 1 && /^[\w./-]+\.(wasm|rs|json|toml)$/.test(code)) return 'text'
  return 'bash'
}
const fence = (lines, kind) => ['', '```' + codeLang(lines, kind), ...lines, '```', '']

function convertPage(md, { title, imageDir, imagePrefix, pagesById }) {
  const stats = { images: 0, code: 0, tables: 0, links: 0 }
  md = md.replace(/\r\n?/g, '\n').replace(/​/g, '')

  // Images: the reference definitions at the end of the export hold the base64 data.
  const images = new Map()
  md = md.replace(
    /^\[(image\d+)\]:\s*<data:image\/(\w+);base64,([^>]*)>[ \t]*$/gm,
    (_, ref, type, data) => {
      const file = `${imagePrefix}-${ref.slice('image'.length)}.${type === 'jpeg' ? 'jpg' : type}`
      fs.mkdirSync(imageDir, { recursive: true })
      fs.writeFileSync(path.join(imageDir, file), Buffer.from(data, 'base64'))
      images.set(ref, `./images/${file}`)
      stats.images++
      return ''
    },
  )
  md = md.replace(/!\[([^\]]*)\]\[(image\d+)\]/g, (m, alt, ref) =>
    images.has(ref) ? `![${alt}](${images.get(ref)})` : m,
  )

  let lines = md.split('\n').map((l) => (l.trim() === '' ? '' : l))

  const rewriteLinks = (line) =>
    line.replace(
      /\[([^\]]*)\]\((https?:\/\/(?:wiki\.xode\.net\/app\/page\/|docs\.google\.com\/document\/d\/)([\w-]+)[^)]*)\)/g,
      (m, text, url, id) => {
        const page = pagesById.get(id)
        if (!page) return m
        stats.links++
        return `[${/^https?:/.test(text) ? page.title : text}](${page.path})`
      },
    )

  // Headings: drop custom anchors, bold and empty headings; split off trailing commands
  // ("STEP 5: Create a shell script: $ nano xode-node.sh"). Prose gets the same split.
  // Lines that are only an in-page link are the Google Docs table of contents.
  const items = []
  for (const line of lines) {
    if (/^\[.*\]\(#.*\)\s*$/.test(line)) continue
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      let text = stripBold(h[2].replace(/\s*\{#[^}]*\}\s*$/, '')).trim()
      if (!text) continue
      if (/^!\[[^\]]*\]\([^)]*\)$/.test(text)) {
        items.push(text) // a logo used as a heading; the real heading follows it
        continue
      }
      const split = text.match(/^(.*?):?\s+(\\\$\s+\S.*)$/)
      items.push({ level: h[1].length, text: rewriteLinks(split ? split[1] : text) })
      if (split) items.push('', split[2])
      continue
    }
    const split = !line.startsWith('|') && !isCommand(line.trim()) && line.match(/^(.*\S:)\s+(\\\$\s+[a-z.\/].*)$/)
    if (split) items.push(rewriteLinks(split[1]), '', split[2])
    else items.push(isCommand(line.trim()) ? line : rewriteLinks(line))
  }
  const levels = items.filter((x) => typeof x === 'object').map((x) => x.level)
  const shift = Math.max(0, Math.min(...levels) - 2)
  lines = items.map((x) =>
    typeof x === 'object' ? `${'#'.repeat(Math.max(2, x.level - shift))} ${x.text}` : x,
  )

  // One-column tables are code boxes in the Google Docs; a second row means the first is a label.
  const untabled = []
  for (let i = 0; i < lines.length; ) {
    if (!lines[i].startsWith('|')) {
      untabled.push(lines[i++])
      continue
    }
    const rows = []
    while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++])
    const cells = rows.map((r) => r.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/))
    if (cells.length >= 2 && cells.every((c) => c.length === 1) && /^\s*:?-+:?\s*$/.test(cells[1][0])) {
      const [head, , ...body] = cells.map((c) => c[0].trim())
      if (body.length) untabled.push('', '`' + unescapeMd(stripBold(head)) + '`')
      untabled.push(...fence((body.length ? body : [head]).flatMap((l) => unflatten(stripPrompt(toCode(l))))))
      stats.tables++
    } else untabled.push(...rows)
  }

  // Command paragraphs, shell scripts (#!), [Section] config snippets and runs of
  // --flag lines -> code blocks.
  const src = untabled
  const out = []
  let block = null
  let inFence = false
  const close = () => {
    if (!block) return
    out.push(...fence(block.lines, block.kind))
    stats.code++
    block = null
  }
  const open = (kind, line) => {
    if (out.length && out.at(-1)) out[out.length - 1] = out.at(-1).trimEnd() // drop hard-break spaces
    block = { kind, lines: [line] }
  }
  const nextNonBlank = (i) => {
    while (i < src.length && src[i] === '') i++
    return src[i] ?? ''
  }
  for (let i = 0; i < src.length; i++) {
    const line = src[i]
    const t = line.trim()
    if (t.startsWith('```')) inFence = !inFence
    if (inFence || t.startsWith('```')) {
      out.push(line)
      continue
    }
    if (block) {
      if (block.kind === 'cmd') {
        if (isCommand(t)) {
          block.lines.push(stripPrompt(toCode(t)))
          continue
        }
        if (t && block.lines.at(-1).endsWith('\\')) {
          block.lines.push(toCode(t))
          continue
        }
        if (!t && isCommand(nextNonBlank(i).trim())) continue // merge consecutive command paragraphs
      } else if (t) {
        block.lines.push(toCode(line))
        continue
      }
      close()
    }
    if (isCommand(t)) open('cmd', stripPrompt(toCode(t)))
    else if (/^\\?-\\?-[a-z]/.test(t)) open('cmd', toCode(t))
    else if (t.startsWith('\\#\\!')) open('script', toCode(t))
    else if (/^\\\[[A-Za-z ]+\\\]$/.test(t)) open('ini', toCode(t))
    else if (!src[i - 1] && !src[i + 1] && (/^sudo\s/.test(t) || /^[A-Z][A-Za-z]+=/.test(t))) {
      out.push(...fence([toCode(t)], t.startsWith('sudo') ? 'cmd' : 'ini'))
      stats.code++
    } else out.push(line)
  }
  close()

  // Collapse runs of blank lines outside code blocks.
  const result = [`# ${title}`, '']
  inFence = false
  for (const line of out) {
    if (line.trim().startsWith('```')) inFence = !inFence
    if (!inFence && line === '' && result.at(-1) === '') continue
    result.push(line)
  }
  while (result.at(-1) === '') result.pop()
  return { text: result.join('\n') + '\n', stats }
}

// Walk the export: one folder per section, one Markdown file per page.
const pages = []
for (const dir of fs.readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
  const sectionSlug = slugify(stripOrder(dir))
  for (const file of fs.readdirSync(path.join(SRC, dir)).filter((f) => f.endsWith('.md')).sort()) {
    const title = stripOrder(file.replace(/\.md$/, ''))
    const slug = slugify(title)
    pages.push({ dir, file, sectionSlug, title, slug, path: `/${sectionSlug}/${slug}` })
  }
}
const pagesById = new Map(
  Object.entries(DOC_IDS)
    .map(([id, title]) => [id, pages.find((p) => p.title === title)])
    .filter(([, page]) => page),
)

for (const page of pages) {
  const md = fs.readFileSync(path.join(SRC, page.dir, page.file), 'utf8')
  const { text, stats } = convertPage(md, {
    title: page.title,
    imageDir: path.join(OUT, page.sectionSlug, 'images'),
    imagePrefix: page.slug,
    pagesById,
  })
  fs.mkdirSync(path.join(OUT, page.sectionSlug), { recursive: true })
  fs.writeFileSync(path.join(OUT, page.sectionSlug, `${page.slug}.md`), text)
  const notes = Object.entries(stats).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(', ')
  console.log(`${page.path}${notes ? `  (${notes})` : ''}`)
}

const logo = fs.readdirSync(SRC).find((f) => /logo/i.test(f))
if (logo) {
  fs.mkdirSync(path.join(OUT, 'public'), { recursive: true })
  fs.copyFileSync(path.join(SRC, logo), path.join(OUT, 'public', 'logo.png'))
}
