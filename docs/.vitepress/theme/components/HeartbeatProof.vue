<script setup lang="ts">
// Before/after diagram for the "phones as nodes" article: moving verification onto the
// phone changes what a heartbeat proves. Labels follow the page's language; colours come
// from the theme so it works in dark mode.
import { computed } from 'vue'
import { useData } from 'vitepress'

const STRINGS = {
  en: {
    aria: 'Moving verification onto the phone changes what a heartbeat proves',
    before: 'Before',
    after: 'After',
    server: 'Server',
    phone: 'Phone',
    blockHeight: 'block height',
    signature: 'signature',
    chain: 'Chain',
    phoneSmoldot: 'Phone · smoldot',
    verifiesFinality: 'verifies finality',
    proves: 'What it proves',
    beforeProof: '"Someone signed a number they were given"',
    afterProof: '"This device followed the chain itself"',
    caption: 'Where verification happens changes what a heartbeat means',
  },
  ko: {
    aria: '검증을 폰으로 옮기면 하트비트가 증명하는 내용이 달라진다',
    before: 'Before',
    after: 'After',
    server: '서버',
    phone: '폰',
    blockHeight: '블록 높이',
    signature: '서명',
    chain: '체인',
    phoneSmoldot: '폰 · smoldot',
    verifiesFinality: '파이널리티 검증',
    proves: '증명되는 것',
    beforeProof: '"누군가 알려준 숫자에 서명했다"',
    afterProof: '"이 기기가 체인을 직접 따라갔다"',
    caption: '검증의 위치가 하트비트의 의미를 바꾼다',
  },
  ja: {
    aria: '検証をスマホに移すと、ハートビートが証明する内容が変わる',
    before: '変更前',
    after: '変更後',
    server: 'サーバー',
    phone: 'スマホ',
    blockHeight: 'ブロック高',
    signature: '署名',
    chain: 'チェーン',
    phoneSmoldot: 'スマホ · smoldot',
    verifiesFinality: 'ファイナリティを検証',
    proves: '証明されること',
    beforeProof: '「誰かが、教えられた数字に署名した」',
    afterProof: '「この端末がチェーンを自ら追跡した」',
    caption: '検証をどこで行うかが、ハートビートの意味を変える',
  },
  zh: {
    aria: '把验证移到手机上，心跳所证明的内容就变了',
    before: '之前',
    after: '之后',
    server: '服务器',
    phone: '手机',
    blockHeight: '区块高度',
    signature: '签名',
    chain: '链',
    phoneSmoldot: '手机 · smoldot',
    verifiesFinality: '验证最终性',
    proves: '证明的是',
    beforeProof: '“有人对别人给的数字签了名”',
    afterProof: '“这台设备亲自跟随了链”',
    caption: '验证在哪里进行，决定了心跳的含义',
  },
}

const { lang } = useData()
const t = computed(() => STRINGS[lang.value.slice(0, 2) as keyof typeof STRINGS] ?? STRINGS.en)
</script>

<template>
  <figure class="hb" :aria-label="t.aria">
    <div class="hb-row">
      <p class="hb-label hb-label-before">{{ t.before }}</p>
      <div class="hb-flow">
        <div class="hb-node">{{ t.server }}</div>
        <div class="hb-links">
          <span class="hb-link hb-link-right">{{ t.blockHeight }}</span>
          <span class="hb-link hb-link-left">{{ t.signature }}</span>
        </div>
        <div class="hb-node">{{ t.phone }}</div>
      </div>
      <p class="hb-proof">
        <span class="hb-proof-label hb-proof-before">{{ t.proves }}</span>
        {{ t.beforeProof }}
      </p>
    </div>

    <div class="hb-row">
      <p class="hb-label hb-label-after">{{ t.after }}</p>
      <div class="hb-flow">
        <div class="hb-node hb-node-chain">{{ t.chain }}<small>P2P</small></div>
        <div class="hb-links">
          <span class="hb-link hb-link-right" />
        </div>
        <div class="hb-node hb-node-phone">{{ t.phoneSmoldot }}<small>{{ t.verifiesFinality }}</small></div>
      </div>
      <p class="hb-proof">
        <span class="hb-proof-label hb-proof-after">{{ t.proves }}</span>
        {{ t.afterProof }}
      </p>
    </div>

    <figcaption class="hb-caption">{{ t.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.hb {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

/* Each row: label on top, then the flow and what it proves side by side. */
.hb-row {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'label label'
    'flow proof';
  align-items: center;
  column-gap: 24px;
  row-gap: 10px;
}

.hb-row + .hb-row {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.hb-label {
  grid-area: label;
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hb-label-before,
.hb-proof-before {
  color: var(--vp-c-warning-1);
}

.hb-label-after,
.hb-proof-after {
  color: var(--vp-c-brand-1);
}

/* Both rows use the same flow width so their boxes and "what it proves" line up. */
.hb-flow {
  grid-area: flow;
  display: flex;
  align-items: stretch;
  gap: 8px;
  width: 380px;
}

.hb-node {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 10px;
  border: 1.5px solid var(--vp-c-text-3);
  border-radius: 8px;
  background: var(--vp-c-bg);
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  color: var(--vp-c-text-1);
}

.hb-node small {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.hb-node-chain {
  border-style: dashed;
}

/* The phone that verifies for itself is the point of the diagram. */
.hb-node-phone {
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-weight: 600;
}

.hb-node-phone small {
  font-weight: 400;
}

.hb-links {
  display: flex;
  flex: 0 0 96px;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

/* An arrow is a labelled line with a triangle head. Rightward arrows carry their label
   above the line, leftward ones below it. */
.hb-link {
  position: relative;
  display: block;
  min-height: 12px;
  padding: 0 8px;
  font-size: 12px;
  line-height: 1.3;
  text-align: center;
  color: var(--vp-c-text-2);
}

.hb-link-right {
  padding-bottom: 4px;
  border-bottom: 1.5px solid var(--vp-c-text-3);
}

.hb-link-left {
  padding-top: 4px;
  border-top: 1.5px solid var(--vp-c-text-3);
}

.hb-link::after {
  content: '';
  position: absolute;
  border: 5px solid transparent;
}

.hb-link-right::after {
  right: -2px;
  bottom: -6px;
  border-left: 8px solid var(--vp-c-text-3);
  border-right: 0;
}

.hb-link-left::after {
  left: -2px;
  top: -6px;
  border-right: 8px solid var(--vp-c-text-3);
  border-left: 0;
}

.hb-proof {
  grid-area: proof;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  text-wrap: pretty;
}

.hb-proof-label {
  display: block;
  font-size: 12px;
}

.hb-caption {
  margin-top: 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* On phones, what it proves goes under the flow. */
@media (max-width: 639px) {
  .hb {
    padding: 16px;
  }

  .hb-row {
    grid-template-columns: 1fr;
    grid-template-areas:
      'label'
      'flow'
      'proof';
  }

  .hb-flow {
    width: auto;
  }

  .hb-node {
    padding: 8px;
  }

  .hb-links {
    flex-basis: 72px;
  }
}
</style>
