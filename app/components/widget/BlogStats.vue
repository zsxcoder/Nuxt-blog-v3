<script setup lang="ts">
import { UtilDate } from '#components'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
// 将服务器时区转换为博客指定时区

const yearlyTip = ref('')

const blogStats = computed(() => [{
	label: '运营时长',
	value: timeElapse(appConfig.timeEstablished),
	tip: `博客于${appConfig.timeEstablished}上线`,
	icon: 'ph:calendar-bold',
	color: 'var(--c-primary)',
}, {
	label: '上次更新',
	value: () => h(UtilDate, {
		date: runtimeConfig.public.buildTime,
		relative: true,
		tipPrefix: '构建于',
	}),
	icon: 'ph:clock-bold',
	color: 'var(--c-accent)',
}, {
	label: '总字数',
	value: computed(() => stats.value ? formatNumber(stats.value.total.words) : ''),
	tip: yearlyTip,
	icon: 'ph:file-text-bold',
	color: 'var(--c-success)',
}])

onMounted(async () => {
	const stats = await $fetch('/api/stats')
	yearlyTip.value = Object.entries(stats.annual).reverse().map(([year, item]) =>
		`${year}年：${item.posts}篇，${formatNumber(item.words)}字`,
	).join('\n')
})
</script>

<template>
<ZWidget title="博客统计">
	<div class="blog-stats">
		<div v-for="(stat, index) in blogStats" :key="index" class="stat-item">
			<div class="stat-icon">
				<Icon :name="stat.icon" :style="{ color: stat.color }" />
			</div>
			<div class="stat-content">
				<div class="stat-value">
					{{ stat.value }}
				</div>
				<div class="stat-label">
					{{ stat.label }}
				</div>
			</div>
		</div>
	</div>
</ZWidget>
</template>

<style lang="scss" scoped>
.blog-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(var(--c-bg-soft-rgb), 0.8) 0%, rgba(var(--c-bg-card-rgb), 0.9) 100%);
  border: 1px solid var(--c-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, rgba(var(--c-primary-rgb), 0.1) 0%, rgba(var(--c-bg-card-rgb), 0.95) 100%);
  }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg-card) 100%);
  border: 1px solid var(--c-border);

  :deep(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--c-text);
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--c-text-2);
  font-weight: 400;
}

.stat-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: rgba(var(--c-text-2-rgb), 0.1);
  color: var(--c-text-2);
  cursor: help;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--c-primary-rgb), 0.1);
    color: var(--c-primary);
  }

  :deep(svg) {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-item {
    padding: 0.625rem;
    gap: 0.625rem;
  }

  .stat-icon {
    width: 2.25rem;
    height: 2.25rem;

    :deep(svg) {
      width: 1.125rem;
      height: 1.125rem;
    }
  }

  .stat-value {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}
</style>
