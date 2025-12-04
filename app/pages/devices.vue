<script setup lang="ts">
import { computed, watch } from 'vue'
import type { WidgetName } from '~/composables/useWidgets'

type Brand = 'IQOO' | (string & {})

const layoutStore = useLayoutStore()
const appConfig = useAppConfig()

// 根据配置决定是否显示侧边栏图片
const asideWidgets = computed<WidgetName[]>(() => {
  const widgets: WidgetName[] = ['blog-stats', 'latest-comments', 'comm-group', 'poetry']
  
  // 如果启用了侧边栏图片，在公告后添加图片组件
  if (appConfig.sidebarImage?.enabled) {
    // 在 'announcement-card' 后插入 'sidebar-image'
    const announcementIndex = widgets.indexOf('announcement-card')
    if (announcementIndex !== -1) {
      widgets.splice(announcementIndex + 1, 0, 'sidebar-image')
    }
  }
  
  return widgets
})

watch(asideWidgets, (newWidgets) => {
  layoutStore.setAside(newWidgets)
}, { immediate: true })

import devices from '../devices'
const brands = computed<Brand[]>(() => (devices as any).brands || [])
const route = useRoute()
const brand = ref<Brand | undefined>((route.query.brand as Brand) || brands.value[0])

watch(brand, (val) => {
	const q = { ...route.query, brand: val }
	navigateTo({ path: route.path, query: q }, { replace: true })
})

const allDevices = computed(() => (devices as any).items || [])
const list = computed(() => allDevices.value.filter((d: any) => d.brand === brand.value))
</script>

<template>
<div class="devices-page">
	<div class="tabs">
		<button
			v-for="b in brands"
			:key="b"
			:class="['tab', { active: b === brand }]"
			@click="brand = b as any"
		>
			{{ b }}
		</button>
	</div>

	<div class="grid">
		<DeviceCard v-for="item in list" :key="item.name" :item="item" />
	</div>
</div>
</template>

<style lang="scss" scoped>
.devices-page {
	min-height: 90vh;
	
	.tabs {
		display: inline-flex;
		gap: 0.5rem;
		margin: 0.5rem 0 1rem;

		.tab {
			padding: 0.5rem 1rem;
			border-radius: 0.5rem;
			background: var(--ld-bg-card);
			border: 1px solid var(--c-border);
			box-shadow: 0 2px 10px var(--ld-shadow);
			transition: all 0.2s;
			font-weight: 600;

			&:hover {
				transform: translateY(-1px);
				box-shadow: 0 6px 16px var(--ld-shadow);
			}

			&.active {
				background: var(--c-primary);
				border-color: transparent;
				color: white;
				box-shadow: 0 8px 20px var(--ld-shadow);
			}

			&:focus-visible {
				outline: 2px solid color-mix(in oklab, var(--c-primary) 60%, white);
				outline-offset: 2px;
			}
		}
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));

		@media (max-width: $breakpoint-mobile) {
			grid-template-columns: 1fr;
		}
	}
}
</style>

