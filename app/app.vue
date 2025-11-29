<script setup>
const showPlayer = ref(false)

onMounted(() => {
	// 确保在客户端显示播放器
	showPlayer.value = true

	// 延迟初始化，确保脚本加载完成
	setTimeout(() => {
		if (window.NeteaseMiniPlayer) {
			window.NeteaseMiniPlayer.init?.()
		}
	}, 500)
})
</script>

<template>
<NuxtLoadingIndicator />
<BlogSkipToContent />
<BlogSidebar />
<div id="content">
	<main id="main-content">
		<NuxtPage />
		<BlogFooter />
	</main>
	<BlogAside />
</div>
<BlogPanel />
<BlogPopover />

<!-- 音乐播放器 - 使用原生HTML确保正确初始化 -->
<ClientOnly>
	<div
		v-if="showPlayer"
		class="netease-mini-player"
		data-playlist-id="13681647281"
		data-theme="auto"
		data-position="bottom-right"
		data-default-minimized="true"
		data-lyric="true"
		data-autoplay="false"
	/>
</ClientOnly>
</template>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss" scoped>
:global(#z-root) {
	display: flex;
	justify-content: center;
	gap: 1rem;
	min-width: 0;
}

:global(.blog-sidebar), :global(.blog-aside) {
	flex-shrink: 0;
	position: sticky;
	top: 0;
	width: 280px;
	height: 100vh;
	height: 100dvh;
	scrollbar-width: thin;
  @media (max-width: $breakpoint-widescreen) {
    flex-shrink: 0.2;
  }
}

#content {
  display: flex;
  gap: 1rem;

  width: $breakpoint-widescreen;
  min-width: 0;

	// 此处不建议给内容设置 padding
	> #main-content {
		flex-grow: 1; // 使较小宽度的内容占满

		// overflow: hidden; // 会使一部分元素吸顶失效

		// 使内容正确计算宽度而不横向溢出
		// 也可设置 width: 0 或者 contain: inline-size（兼容性不佳）
		min-width: 0;
	}
}

// 音乐播放器样式调整
.netease-mini-player {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 9999;
}
</style>