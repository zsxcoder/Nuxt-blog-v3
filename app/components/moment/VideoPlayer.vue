<script setup lang="ts">
const props = withDefaults(defineProps<{
	type?: 'bilibili' | 'youtube' | 'raw'
	id: string
	autoplay?: boolean
	ratio?: string | number
	poster?: string
	width?: string
}>(), { type: 'raw' })

const ratio = computed(() => props.ratio || (props.type === 'raw' ? undefined : 16 / 9))

const src = computed(() => {
	switch (props.type) {
		case 'bilibili':
			return `https://player.bilibili.com/player.html?bvid=${props.id}&autoplay=${props.autoplay}`
		case 'youtube':
			return `https://www.youtube.com/embed/${props.id}?rel=0&disablekb=1&playsinline=1&autoplay=${props.autoplay}`
		default:
			return props.id
	}
})
</script>

<template>
<div class="video" :style="{ aspectRatio: ratio, maxWidth: width }">
	<video v-if="type === 'raw'" :src="src" :poster="poster" controls />
	<iframe
		v-else
		:src="src"
		scrolling="no"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/>
</div>
</template>

<style scoped>
.video{ overflow:hidden;margin:2rem auto;border-radius:.8rem;box-shadow:0 2px .5rem var(--ld-shadow); }
iframe,video{ display:block;width:100%;height:100%; }
</style>
