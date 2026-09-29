<script setup lang="ts">
// Diagram of XODE moving from Kusama (para ID 3344) to Polkadot (para ID 3417).
// Labels follow the page's language; colours come from the theme so it works in dark mode.
import { computed } from 'vue'
import { useData } from 'vitepress'

const STRINGS = {
  en: {
    title: 'XODE parachain migration',
    kusama: 'Kusama Relay Chain',
    polkadot: 'Polkadot Relay Chain',
    paraId: 'Para ID',
    former: 'Former',
    current: 'Current',
    moved: 'Moved to Polkadot',
    otherParachains: 'Other parachains',
  },
  ko: {
    title: 'XODE 파라체인 이전',
    kusama: 'Kusama 릴레이 체인',
    polkadot: 'Polkadot 릴레이 체인',
    paraId: 'Para ID',
    former: '이전',
    current: '현재',
    moved: 'Polkadot으로 이전',
    otherParachains: '다른 파라체인',
  },
  ja: {
    title: 'XODE パラチェーンの移行',
    kusama: 'Kusama リレーチェーン',
    polkadot: 'Polkadot リレーチェーン',
    paraId: 'Para ID',
    former: '以前',
    current: '現在',
    moved: 'Polkadot へ移行',
    otherParachains: '他のパラチェーン',
  },
  zh: {
    title: 'XODE 平行链迁移',
    kusama: 'Kusama 中继链',
    polkadot: 'Polkadot 中继链',
    paraId: 'Para ID',
    former: '以前',
    current: '当前',
    moved: '迁移至 Polkadot',
    otherParachains: '其他平行链',
  },
}

const { lang } = useData()
const t = computed(() => STRINGS[lang.value.slice(0, 2) as keyof typeof STRINGS] ?? STRINGS.en)

// Parachains around the relay chain ring; XODE sits at the top-right position.
const ring = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * 2 * Math.PI - Math.PI / 4
  return { x: 60 + 40 * Math.cos(a), y: 60 + 40 * Math.sin(a), xode: i === 0 }
})

const chains = computed(() => [
  { key: 'kusama', relay: t.value.kusama, id: 3344, status: t.value.former, current: false },
  { key: 'polkadot', relay: t.value.polkadot, id: 3417, status: t.value.current, current: true },
])
</script>

<template>
  <figure class="pm" :aria-label="t.title">
    <template v-for="(c, i) in chains" :key="c.key">
      <div v-if="i === 1" class="pm-arrow">
        <span class="pm-arrow-line" />
        <span class="pm-arrow-label">{{ t.moved }}</span>
      </div>
      <div class="pm-card" :class="{ 'pm-current': c.current }">
        <span class="pm-status">{{ c.status }}</span>
        <svg viewBox="0 0 120 120" class="pm-ring" role="img" :aria-label="`${c.relay}, XODE ${t.paraId} ${c.id}`">
          <circle cx="60" cy="60" r="40" class="pm-relay" />
          <line
            v-for="(p, j) in ring"
            :key="'l' + j"
            x1="60" y1="60" :x2="p.x" :y2="p.y"
            class="pm-spoke" :class="{ 'pm-spoke-xode': p.xode }"
          />
          <circle cx="60" cy="60" r="14" class="pm-hub" />
          <circle
            v-for="(p, j) in ring"
            :key="'p' + j"
            :cx="p.x" :cy="p.y" :r="p.xode ? 11 : 6"
            :class="p.xode ? 'pm-xode' : 'pm-para'"
          />
        </svg>
        <div class="pm-relay-name">{{ c.relay }}</div>
        <div class="pm-para-chip">XODE · {{ t.paraId }} <strong>{{ c.id }}</strong></div>
      </div>
    </template>
    <figcaption class="pm-legend">
      <span><i class="pm-dot pm-dot-xode" /> XODE</span>
      <span><i class="pm-dot pm-dot-para" /> {{ t.otherParachains }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.pm {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.pm-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.pm-current {
  border: 2px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.pm-status {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.pm-current .pm-status {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.pm-ring {
  width: 100%;
  max-width: 140px;
}

.pm-relay {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 2;
}

.pm-spoke {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}

.pm-hub {
  fill: var(--vp-c-text-3);
}

.pm-para {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
}

/* On the former chain XODE is shown hollow; on the current one it is filled. */
.pm-xode {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-text-2);
  stroke-width: 2;
  stroke-dasharray: 3 2;
}

.pm-current .pm-xode {
  fill: var(--vp-c-brand-1);
  stroke: var(--vp-c-brand-1);
  stroke-dasharray: none;
}

.pm-current .pm-spoke-xode {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.pm-relay-name {
  font-weight: 600;
  text-align: center;
}

.pm-para-chip {
  font-size: 14px;
  text-align: center;
}

.pm-current .pm-para-chip strong {
  color: var(--vp-c-brand-1);
}

.pm-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-align: center;
}

.pm-arrow-line {
  position: relative;
  width: 64px;
  height: 2px;
  background: var(--vp-c-brand-1);
}

.pm-arrow-line::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -5px;
  border: 6px solid transparent;
  border-left: 9px solid var(--vp-c-brand-1);
  border-right: 0;
}

.pm-legend {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.pm-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  border-radius: 50%;
  vertical-align: -1px;
}

.pm-dot-xode {
  background: var(--vp-c-brand-1);
}

.pm-dot-para {
  border: 1.5px solid var(--vp-c-text-3);
}

/* Stack vertically on phones, with the arrow pointing down. */
@media (max-width: 639px) {
  .pm {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .pm-arrow-line {
    width: 2px;
    height: 40px;
  }

  .pm-arrow-line::after {
    right: auto;
    left: -5px;
    top: auto;
    bottom: -2px;
    border: 6px solid transparent;
    border-top: 9px solid var(--vp-c-brand-1);
    border-bottom: 0;
  }
}
</style>
