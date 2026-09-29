import { defineConfig, type DefaultTheme } from 'vitepress'

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

export default defineConfig({
  title: 'XODE Wiki',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#ed1f7a' }],
  ],

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
