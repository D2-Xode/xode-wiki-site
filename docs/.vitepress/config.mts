import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress'

const SITE_URL = 'https://wiki.xode.net'

// English lives at the root; each translation mirrors it under docs/<lang>/ with the
// same file names. Translated pages reuse the English images (../../<section>/images/).
type Labels = {
  nav: { start: string; node: string }
  sections: Record<string, string>
  pages: Record<string, string>
}

// Each page lives at docs/<section>/<page>.md. Add new pages here to show them in the
// sidebar, then add their titles to every locale's `pages` below.
const SIDEBAR: [section: string, pages: string[]][] = [
  ['introduction', ['lets-get-started', 'polkadot-ecosystem', 'web3', 'xode-blockchain', 'xode-governance']],
  ['network', ['compiling-xode', 'runtime-upgrade', 'xode-network', 'xode-node', 'xode-node-kusama-3344', 'xode-staking', 'xode-transaction-fees']],
  ['security', ['block-verification', 'security-mechanism']],
  ['smart-contract', ['evm-smart-contract', 'wasm-smart-contract']],
  ['wallets', ['xterium-wallet-beta']],
  ['xon', ['other-assets', 'tokenomics', 'xon-utility-token']],
  ['engineering', ['phones-as-nodes']],
]

const sidebar = (prefix: string, l: Labels): DefaultTheme.SidebarItem[] =>
  SIDEBAR.map(([section, pages]) => ({
    text: l.sections[section],
    collapsed: false,
    items: pages.map((page) => ({ text: l.pages[page], link: `${prefix}/${section}/${page}` })),
  }))

const nav = (prefix: string, l: Labels): DefaultTheme.NavItem[] => [
  { text: l.nav.start, link: `${prefix}/introduction/lets-get-started` },
  { text: l.nav.node, link: `${prefix}/network/xode-node` },
  { text: 'xode.net', link: 'https://www.xode.net' },
]

const en: Labels = {
  nav: { start: 'Get started', node: 'Run a node' },
  sections: {
    introduction: 'Introduction',
    network: 'Network',
    security: 'Security',
    'smart-contract': 'Smart Contract',
    wallets: 'Wallets',
    xon: 'XON',
    engineering: 'Engineering',
  },
  pages: {
    'lets-get-started': "Let's get started",
    'polkadot-ecosystem': 'Polkadot Ecosystem',
    web3: 'Web3',
    'xode-blockchain': 'XODE Blockchain',
    'xode-governance': 'XODE Governance',
    'compiling-xode': 'Compiling XODE',
    'runtime-upgrade': 'Runtime Upgrade',
    'xode-network': 'XODE Network',
    'xode-node': 'XODE Node',
    'xode-node-kusama-3344': 'XODE Node (Kusama 3344, legacy)',
    'xode-staking': 'XODE Staking',
    'xode-transaction-fees': 'XODE Transaction Fees',
    'block-verification': 'Block Verification',
    'security-mechanism': 'Security Mechanism',
    'evm-smart-contract': 'EVM Smart Contract',
    'wasm-smart-contract': 'WASM Smart Contract',
    'xterium-wallet-beta': 'Xterium Wallet',
    'other-assets': 'Other Assets',
    tokenomics: 'Tokenomics',
    'xon-utility-token': 'XON Utility Token',
    'phones-as-nodes': 'When Phones Become Nodes',
  },
}

const ko: Labels = {
  nav: { start: '시작하기', node: '노드 실행' },
  sections: {
    introduction: '소개',
    network: '네트워크',
    security: '보안',
    'smart-contract': '스마트 컨트랙트',
    wallets: '지갑',
    xon: 'XON',
    engineering: '엔지니어링',
  },
  pages: {
    'lets-get-started': '시작하기',
    'polkadot-ecosystem': 'Polkadot 생태계',
    web3: 'Web3',
    'xode-blockchain': 'XODE 블록체인',
    'xode-governance': 'XODE 거버넌스',
    'compiling-xode': 'XODE 컴파일',
    'runtime-upgrade': '런타임 업그레이드',
    'xode-network': 'XODE 네트워크',
    'xode-node': 'XODE 노드',
    'xode-node-kusama-3344': 'XODE 노드 (Kusama 3344, 레거시)',
    'xode-staking': 'XODE 스테이킹',
    'xode-transaction-fees': 'XODE 거래 수수료',
    'block-verification': '블록 검증',
    'security-mechanism': '보안 메커니즘',
    'evm-smart-contract': 'EVM 스마트 컨트랙트',
    'wasm-smart-contract': 'WASM 스마트 컨트랙트',
    'xterium-wallet-beta': 'Xterium 지갑',
    'other-assets': '기타 자산',
    tokenomics: '토크노믹스',
    'xon-utility-token': 'XON 유틸리티 토큰',
    'phones-as-nodes': '폰이 노드가 될 때',
  },
}

const ja: Labels = {
  nav: { start: 'はじめに', node: 'ノードを実行' },
  sections: {
    introduction: 'イントロダクション',
    network: 'ネットワーク',
    security: 'セキュリティ',
    'smart-contract': 'スマートコントラクト',
    wallets: 'ウォレット',
    xon: 'XON',
    engineering: 'エンジニアリング',
  },
  pages: {
    'lets-get-started': 'はじめに',
    'polkadot-ecosystem': 'Polkadot エコシステム',
    web3: 'Web3',
    'xode-blockchain': 'XODE ブロックチェーン',
    'xode-governance': 'XODE ガバナンス',
    'compiling-xode': 'XODE のコンパイル',
    'runtime-upgrade': 'ランタイムアップグレード',
    'xode-network': 'XODE ネットワーク',
    'xode-node': 'XODE ノード',
    'xode-node-kusama-3344': 'XODE ノード (Kusama 3344、旧版)',
    'xode-staking': 'XODE ステーキング',
    'xode-transaction-fees': 'XODE トランザクション手数料',
    'block-verification': 'ブロック検証',
    'security-mechanism': 'セキュリティメカニズム',
    'evm-smart-contract': 'EVM スマートコントラクト',
    'wasm-smart-contract': 'WASM スマートコントラクト',
    'xterium-wallet-beta': 'Xterium ウォレット',
    'other-assets': 'その他のアセット',
    tokenomics: 'トークノミクス',
    'xon-utility-token': 'XON ユーティリティトークン',
    'phones-as-nodes': 'スマホがノードになるとき',
  },
}

const zh: Labels = {
  nav: { start: '快速开始', node: '运行节点' },
  sections: {
    introduction: '简介',
    network: '网络',
    security: '安全',
    'smart-contract': '智能合约',
    wallets: '钱包',
    xon: 'XON',
    engineering: '工程',
  },
  pages: {
    'lets-get-started': '快速开始',
    'polkadot-ecosystem': 'Polkadot 生态系统',
    web3: 'Web3',
    'xode-blockchain': 'XODE 区块链',
    'xode-governance': 'XODE 治理',
    'compiling-xode': '编译 XODE',
    'runtime-upgrade': '运行时升级',
    'xode-network': 'XODE 网络',
    'xode-node': 'XODE 节点',
    'xode-node-kusama-3344': 'XODE 节点 (Kusama 3344，旧版)',
    'xode-staking': 'XODE 质押',
    'xode-transaction-fees': 'XODE 交易费用',
    'block-verification': '区块验证',
    'security-mechanism': '安全机制',
    'evm-smart-contract': 'EVM 智能合约',
    'wasm-smart-contract': 'WASM 智能合约',
    'xterium-wallet-beta': 'Xterium 钱包',
    'other-assets': '其他资产',
    tokenomics: '代币经济学',
    'xon-utility-token': 'XON 实用代币',
    'phones-as-nodes': '当手机成为节点',
  },
}

// The old wiki served each page at /app/page/<Google Doc ID>. Each of those URLs gets a
// redirect to the new page, so old links and search results still land somewhere.
const OLD_WIKI_PAGES: Record<string, string> = {
  '1-t_tn665WK341JCEhImWkpzXnhbq1Hed8MSCksEibyM': '/introduction/lets-get-started',
  '1GRKFVoxUxGWHi8k2IEab72UKAM6USNJh-sqINPDGxkI': '/introduction/polkadot-ecosystem',
  '1szCtaZbFAyJwhc8IGLrZhfRnADXZmK8aMxlsW41DZjA': '/introduction/web3',
  '1sNm5lmOVbj6I6BtJDF0sxo6Ko2V46E2SVRoX9qR4zYQ': '/introduction/xode-blockchain',
  '1w1op4Mczwu6yDwOhJLcZ0-OaU698AyNl1oN_HZloEPs': '/introduction/xode-governance',
  '11d4zRkfttxAYslhtw_KYuMqC7MPb6Jfmf6AebnUs3wI': '/network/compiling-xode',
  '1Cw6d0gBFsnlfHabmMQCMfOydrYivfNlQYjoU1Esnk1g': '/network/runtime-upgrade',
  '1mcT3wXrFokrJ3XGerm8zkHq9KpO_YW6xNf9ueJNNvRg': '/network/xode-network',
  '1it-qnmkhAO-aDiNsh3f8jZRCHWEv8zKPwe-DeyfnMQg': '/network/xode-node',
  '1kWGdbgYQOk0LLZnEuDHZ6BQvMm73n6vqpXejLEZkkeQ': '/network/xode-node-kusama-3344',
  '1WwBLI00nnQu8IDGQ8EiPRcVJ0PfXElBzTpyazBc4RtA': '/network/xode-staking',
  '18pdu5dzeRZnbqX-qTInwKK-Yj6PqrqlQvyjZOKbmH94': '/network/xode-transaction-fees',
  '1bvAoWjHjLd9QgtmnBiY7jj1fA2Hw-upPOGgbXlV-tX0': '/security/block-verification',
  '1SnXpvUkZx4Y6OvW47KD8qjiW_5X5XnvixRKHIJnix6Y': '/security/security-mechanism',
  '1mth3xJhr6iqEBtmHWWnG8hdzj7VD9wc83s2pwnPWnJA': '/smart-contract/evm-smart-contract',
  '1G-ekjk-oE3iyjuDXFTMlp4PFe2ROsKhi8BFPz713Vd0': '/smart-contract/wasm-smart-contract',
  '1A-lmbc6PY3eV302sd7wHPlxDjOo-7XoyKklq8Fcnymo': '/wallets/xterium-wallet-beta',
  '18Du-oKCHzxTQZnAeKEq02RXWy2dE6qpAhgeDBFE1jQw': '/xon/other-assets',
  '1YOGj63VMjNRUtZ6tLeBNSPpnam36yJG1FXkzrS5fRpE': '/xon/tokenomics',
  '1gcFIvd2zd_UPczJk2FrtLiAr8pV1OC7PnXmTQm3KmDE': '/xon/xon-utility-token',
}

const redirectPage = (to: string) => `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>XODE Wiki</title>
<link rel="canonical" href="${SITE_URL}${to}">
<meta http-equiv="refresh" content="0; url=${to}">
<p>This page has moved to <a href="${to}">${SITE_URL}${to}</a>.</p>
`

// The address search engines should index: the clean URL, with home pages ending in "/".
const pageUrl = (relativePath: string) =>
  `${SITE_URL}/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`

// A page without a `description` in its frontmatter is described, in search results and
// link previews, by its first paragraph of prose.
function leadParagraph(markdown: string): string | undefined {
  const lines = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').split(/\r?\n/)
  const para: string[] = []
  let inFence = false
  for (const line of lines) {
    const fence = /^\s*(```|~~~)/.test(line)
    if (fence) inFence = !inFence
    // Headings, HTML, tables, quotes, images, containers and lists aren't prose.
    const prose =
      !fence && !inFence && line.trim() !== '' && !/^\s*([#<|>]|!\[|:::|[*+-]\s|\d+\.\s)/.test(line)
    if (prose) para.push(line.trim())
    else if (para.length) break
  }
  const text = para
    .join(' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*`]/g, '')
    .replace(/\\(.)/g, '$1')
    // VitePress writes the description into a double-quoted attribute without escaping it.
    .replace(/"([^"]*)"/g, '“$1”')
    .replace(/"/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text ? clip(text) : undefined
}

// Search results show about 155 characters of a description, and about half as many
// CJK or Hangul characters, which are twice as wide. Longer text is cut at a sentence
// end, or failing that at a word.
function clip(text: string): string {
  const max = /[぀-ヿ㐀-鿿가-힯]/.test(text) ? 90 : 160
  if (text.length <= max) return text
  const head = text.slice(0, max)
  // A full stop followed by a lowercase word is an abbreviation ("vs. when"), not an end.
  const sentence = [...head.matchAll(/[.!?](?= [^a-z])|[。！？]/g)].at(-1)?.index ?? -1
  if (sentence > max / 2) return head.slice(0, sentence + 1)
  const space = head.lastIndexOf(' ')
  return (space > max / 2 ? head.slice(0, space) : head.slice(0, max - 1)).replace(/[\s,.;:、，]+$/, '') + '…'
}

export default defineConfig({
  title: 'XODE Wiki',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: SITE_URL },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#ed1f7a' }],
    ['meta', { property: 'og:site_name', content: 'XODE Wiki' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/logo.png` }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  transformPageData(pageData, { siteConfig }) {
    if (pageData.description) return
    const lead = leadParagraph(fs.readFileSync(path.join(siteConfig.srcDir, pageData.filePath), 'utf8'))
    if (lead) pageData.description = lead
  },

  transformHead({ pageData, siteData, title, description }) {
    if (pageData.isNotFound) return
    const url = pageUrl(pageData.relativePath)
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: pageData.frontmatter.layout === 'home' ? 'website' : 'article' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:locale', content: siteData.lang.replace('-', '_') }],
    ]
    // Tells Google the site's name, which it shows above the result in place of the URL.
    if (pageData.relativePath === 'index.md') {
      const website = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'XODE Wiki',
        alternateName: ['XODE Blockchain Wiki', 'XODE Docs'],
        url: `${SITE_URL}/`,
        description,
        inLanguage: ['en-US', 'ko-KR', 'ja-JP', 'zh-CN'],
        publisher: { '@type': 'Organization', name: 'XODE', url: 'https://www.xode.net', logo: `${SITE_URL}/logo.png` },
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(website)])
    }
    return head
  },

  buildEnd({ outDir }) {
    for (const [id, page] of Object.entries(OLD_WIKI_PAGES)) {
      const file = path.join(outDir, 'app', 'page', `${id}.html`)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, redirectPage(page))
    }
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description: 'Guides and reference for the XODE Blockchain.',
      themeConfig: { nav: nav('', en), sidebar: sidebar('', en) },
    },
    ko: {
      label: '한국어',
      lang: 'ko-KR',
      description: 'XODE 블록체인 가이드 및 레퍼런스',
      themeConfig: {
        nav: nav('/ko', ko),
        sidebar: sidebar('/ko', ko),
        outline: { level: [2, 3], label: '이 페이지의 내용' },
        docFooter: { prev: '이전 페이지', next: '다음 페이지' },
        lastUpdated: { text: '마지막 업데이트' },
        langMenuLabel: '언어 변경',
        returnToTopLabel: '맨 위로',
        sidebarMenuLabel: '메뉴',
        darkModeSwitchLabel: '테마',
        lightModeSwitchTitle: '라이트 모드로 전환',
        darkModeSwitchTitle: '다크 모드로 전환',
        notFound: { title: '페이지를 찾을 수 없습니다', quote: '', linkText: '홈으로 돌아가기' },
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja-JP',
      description: 'XODE ブロックチェーンのガイドとリファレンス',
      themeConfig: {
        nav: nav('/ja', ja),
        sidebar: sidebar('/ja', ja),
        outline: { level: [2, 3], label: 'このページの内容' },
        docFooter: { prev: '前のページ', next: '次のページ' },
        lastUpdated: { text: '最終更新日' },
        langMenuLabel: '言語を変更',
        returnToTopLabel: 'トップへ戻る',
        sidebarMenuLabel: 'メニュー',
        darkModeSwitchLabel: 'テーマ',
        lightModeSwitchTitle: 'ライトモードに切り替え',
        darkModeSwitchTitle: 'ダークモードに切り替え',
        notFound: { title: 'ページが見つかりません', quote: '', linkText: 'ホームに戻る' },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'XODE 区块链指南与参考',
      themeConfig: {
        nav: nav('/zh', zh),
        sidebar: sidebar('/zh', zh),
        outline: { level: [2, 3], label: '本页内容' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新于' },
        langMenuLabel: '切换语言',
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        notFound: { title: '页面未找到', quote: '', linkText: '返回首页' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
    outline: { level: [2, 3] },
    search: {
      provider: 'local',
      options: {
        locales: {
          ko: {
            translations: {
              button: { buttonText: '검색', buttonAriaLabel: '검색' },
              modal: {
                noResultsText: '검색 결과가 없습니다',
                resetButtonTitle: '검색 지우기',
                footer: { selectText: '선택', navigateText: '이동', closeText: '닫기' },
              },
            },
          },
          ja: {
            translations: {
              button: { buttonText: '検索', buttonAriaLabel: '検索' },
              modal: {
                noResultsText: '結果が見つかりません',
                resetButtonTitle: '検索をクリア',
                footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' },
              },
            },
          },
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到相关结果',
                resetButtonTitle: '清除搜索',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },
  },
})
