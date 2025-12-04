<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const props = defineProps<{ markdown: string }>()

const md = new MarkdownIt({
	html: true, // 支持内嵌 HTML
	linkify: true, // 自动识别链接
	typographer: true, // 智能引号、省略号等
})

const html = md.render(props.markdown)
</script>

<template>
<div class="moment-text prose" v-html="html" />
</template>
