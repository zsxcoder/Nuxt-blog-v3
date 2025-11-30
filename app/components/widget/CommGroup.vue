<template>
<BlogWidget
	card
	dim
	title="TG 频道"
	bg-img="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/image.3yew14hl6d.webp"
	bg-right
>
	<div class="title text-creative">
		加入我们
	</div>

	<Tip copy :icon="false" :tip-options="{ placement: 'left' }">
		<Icon name="mdi:telegram" />https://t.me/kemiaofx_me
	</Tip>
</BlogWidget>
</template>

<style lang="scss" scoped>
.title {
	background-clip: text;
	background-image: linear-gradient(60deg, var(--c-accent) -30%, var(--c-primary), var(--c-text-1));
	background-position: 100% 0;
	background-size: 200%;
	font-size: 1.8em;
	font-weight: 800;
	letter-spacing: 0.05em;
	color: transparent;
	transition: background-position 0.2s;

	.widget:hover & {
		background-position: 0 0;
	}
}

.tip {
	font-size: 0.9em;
	line-height: 2;
}

:deep(.bg-img).bg-img.bg-img {
	opacity: 0.5;
}
</style>
