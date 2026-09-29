# XODE Wiki

The XODE Blockchain wiki, built with [VitePress](https://vitepress.dev). Pages are
Markdown files in `docs/`, and the build output is a static site that any static host
can serve.

## Run it locally

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Pages reload as you edit them.

## Edit the wiki

- Each page is `docs/<section>/<page>.md`, and its URL is `/<section>/<page>`.
- Images go in `docs/<section>/images/` and are linked relatively, e.g.
  `![Staking screen](./images/xode-staking-1.png)`.
- To add a page, create the Markdown file and add it to `SIDEBAR` in
  `docs/.vitepress/config.mts`. The sidebar isn't generated automatically.
- Translations live in `docs/ko/` (Korean), `docs/ja/` (Japanese) and `docs/zh/`
  (Simplified Chinese), mirroring the English file names, and are served at `/ko/...`,
  `/ja/...` and `/zh/...`. They reuse the English images via `../../<section>/images/`.
  When you add or change an English page, update each translation too; new pages also
  need a title in every locale's `pages` list in `docs/.vitepress/config.mts`.
- Authored articles go in `docs/engineering/`. Start them with `pageClass: article-page`
  in the frontmatter to get the article layout (eyebrow, byline, pull quotes); copy
  `phones-as-nodes.md` as a template. Its Korean version is the original.
- The home page is `docs/index.md`. Site title, nav links and search settings are in
  `docs/.vitepress/config.mts`. Brand colours are in `docs/.vitepress/theme/custom.css`.

## Build and deploy

```bash
npm run build     # outputs static files to docs/.vitepress/dist
npm run preview   # serves that build at http://localhost:4173
```

To deploy, connect the repository to a static host such as Vercel, Netlify or
Cloudflare Pages with:

| Setting          | Value                  |
| ---------------- | ---------------------- |
| Build command    | `npm run build`        |
| Output directory | `docs/.vitepress/dist` |

Then point your domain (for example `wiki.xode.net`) at the host. Pages use URLs
without `.html`, which these hosts and GitHub Pages all support.

## Where the content came from

The pages were imported from the Google Drive folder behind the old wiki at
wiki.xode.net. `scripts/import-drive-export.mjs` did the conversion: it saved the
embedded images as files, turned commands into code blocks, and removed the Google
Docs tables of contents. The import was meant to run only once. Running it again
overwrites every page and discards any edits made here since.
