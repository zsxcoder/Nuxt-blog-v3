<script setup lang="ts">
const appConfig = useAppConfig()

interface UmamiStatsResponse {
  today_uv: number | null
  today_pv: number | null
  yesterday_uv?: number | null
  yesterday_pv?: number | null
  last_month_pv?: number | null
  total_uv?: number | null
  total_pv?: number | null
  online_users?: number | null
}

const umamiStats = ref<UmamiStatsResponse | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

async function fetchUmamiStats() {
  const url = (appConfig as any).analytics?.umamiStatsApi as string | undefined

  if (!import.meta.client || !url)
    return

  isLoading.value = true
  hasError.value = false

  try {
    const res = await fetch(url)
    if (!res.ok)
      throw new Error(`Failed to fetch Umami stats: ${res.status}`)

    const data = await res.json()
    umamiStats.value = data
  }
  catch (error) {
    console.error('Failed to load Umami stats (about/umami.vue):', error)
    hasError.value = true
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUmamiStats()
})
</script>

<template>
  <div class="author-content-item social umami">
    <div class="author-content-item-tips">
      统计
    </div>

    <div class="umami-stats">
      <div v-if="!umamiStats && isLoading" class="umami-placeholder">
        正在加载访问统计…
      </div>
      <div v-else-if="!umamiStats && hasError" class="umami-placeholder">
        暂无法获取访问统计。
      </div>
      <div v-else-if="umamiStats" class="umami-stats-grid">
        <div class="umami-stat-chip">
          <span class="label">今日 PV</span>
          <span class="value">{{ umamiStats.today_pv ?? '-' }}</span>
        </div>
        <div class="umami-stat-chip">
          <span class="label">今日 UV</span>
          <span class="value">{{ umamiStats.today_uv ?? '-' }}</span>
        </div>


        <div v-if="umamiStats.yesterday_pv != null" class="umami-stat-chip">
          <span class="label">昨日 PV</span>
          <span class="value">{{ umamiStats.yesterday_pv }}</span>
        </div>
        <div v-if="umamiStats.yesterday_uv != null" class="umami-stat-chip">
          <span class="label">昨日 UV</span>
          <span class="value">{{ umamiStats.yesterday_uv }}</span>
        </div>
        <div v-if="umamiStats.total_pv != null" class="umami-stat-chip">
          <span class="label">累计 PV</span>
          <span class="value">{{ umamiStats.total_pv }}</span>
        </div>
        <div v-if="umamiStats.total_uv != null" class="umami-stat-chip">
          <span class="label">累计 UV</span>
          <span class="value">{{ umamiStats.total_uv }}</span>
        </div>
        <div v-if="umamiStats.online_users != null" class="umami-stat-chip">
          <span class="label">在线人数</span>
          <span class="value">{{ umamiStats.online_users }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.author-content-item.social.umami {
  background: transparent;
  border: none;
  padding: 0;
}

.author-content-item-tips {
  opacity: 0.8;
  font-size: 12px;
  margin-bottom: 0.5rem;
}

.umami-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.umami-stat-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.45rem 0.9rem;
  font-size: 0.8rem;
  border-radius: 1rem;
  background-color: color-mix(in srgb, currentColor 5%, transparent);
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  color: var(--c-text-1);
  transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
}

.umami-stat-chip .label {
  opacity: 0.8;
}

.umami-stat-chip .value {
  font-weight: 600;
}

.umami-stat-chip:hover {
  background-color: color-mix(in srgb, currentColor 10%, transparent);
  border-color: color-mix(in srgb, currentColor 25%, transparent);
  transform: translateY(-2px);
}

.umami-placeholder {
  font-size: 0.8rem;
  color: var(--c-text-3);
}

@media (max-width: 768px) {
  .umami-stat-chip {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
}
</style>
