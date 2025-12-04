<script setup lang="ts">
interface Repo { name: string, description: string, url: string, stars?: number }
const props = defineProps<{ repo: string | Repo, showStars?: boolean }>()

const isShort = typeof props.repo === 'string'
const { data: remote } = await useFetch('/api/github-repo', {
	params: isShort ? { repo: props.repo } : {},
	key: isShort ? `gh-${props.repo}` : undefined,
	immediate: isShort,
})
const target = computed<Repo>(() => !isShort ? props.repo as Repo : (remote.value as Repo) || { name: props.repo, description: '', url: `https://github.com/${props.repo}` })
</script>

<template>
<a :href="target.url" target="_blank" rel="noopener noreferrer" class="gh-card gradient-card">
	<div class="gh-info">
		<span class="gh-icon"><Icon name="bi:github" /></span>
		<div class="gh-title">{{ target.name }}</div>
		<div v-if="showStars && target.stars != null" class="gh-stars"><Icon name="ph:star-bold" /><span>{{ target.stars }}</span></div>
	</div>
	<div v-if="target.description" class="gh-desc">{{ target.description }}</div>
</a>
</template>

<style scoped>
.gh-card{ position:relative;overflow:hidden;border-radius:8px;box-shadow:0 0 0 1px var(--c-bg-soft,#fff);transition:transform .2s ease;display:block;text-decoration:none;color:inherit; }
.gh-card:hover{ transform:translateY(-2px); }
.gh-info{ display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:10px; }
.gh-icon{ font-size:18px;opacity:.8; }
.gh-title{ font-weight:600;font-family:var(--font-mono,ui-monospace,monospace);word-break:break-all; }
.gh-stars{ display:inline-flex;align-items:center;gap:4px;color:#f59e0b; }
.gh-desc{ padding:0 10px 10px;color:var(--c-text-2,hsl(var(--bc)/.6));font-size:.9rem;line-height:1.5; }
</style>
