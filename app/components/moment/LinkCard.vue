<script setup lang="ts">
interface Props {
	url: string
	title?: string
	description?: string
	icon?: string
}
const props = defineProps<Props>()

const host = computed(() => new URL(props.url).host)

/* 完全去掉 onMounted 和 fetchMeta */
</script>

<template>
<a :href="url" target="_blank" rel="noopener" class="link-card">
	<img v-if="icon" :src="icon" class="link-icon" alt="icon">
	<div class="link-main">
		<h4 v-if="title" class="link-title">{{ title }}</h4>
		<p v-if="description" class="link-desc">{{ description }}</p>
		<span class="link-host">{{ host }}</span>
	</div>
</a>
</template>

<style scoped>
.link-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-bg-1);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}
.link-card:hover {
  border-color: var(--c-primary);
  box-shadow: 0 2px 8px var(--ld-shadow);
}
.link-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}
.link-main {
  flex: 1;
  min-width: 0;
}
.link-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.link-desc {
  font-size: 0.8125rem;
  color: var(--c-text-2);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.link-host {
  font-size: 0.75rem;
  color: var(--c-text-3);
}
</style>
