<script setup lang="ts">
import type { MomentItem } from '~/types/moments'

/* stylelint-disable-next-line @stylistic/linebreaks */
type Music = NonNullable<MomentItem['music']>[number]

defineProps<{
	list: Music[]
}>()
</script>

<template>
<!-- 一个 moment 可能有多首歌，循环渲染 -->
<div v-for="(item, idx) in list" :key="idx" class="moment-music">
	<meting-js
		:id="String(item.id)"
		:server="item.server"
		:type="item.type"
		:autoplay="!!item.autoplay"
		:theme="item.theme || '#1e90ff'"
		:mode="item.mode || 'mini'"
		:name="item.name || undefined"
		:cover="item.cover || undefined"
	/>
</div>
</template>

<style scoped>
/* 让播放器宽度自适应，下方留一点间距 */
.moment-music {
  width: 100%;
  margin: 12px 0;
}
</style>

<style>
/* 浅色模式保持默认 */
.moment-music .aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: inherit;
}

/* 深色模式：歌名 = 橙色 */
.dark .moment-music .aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: #000000 !important;
}
</style>