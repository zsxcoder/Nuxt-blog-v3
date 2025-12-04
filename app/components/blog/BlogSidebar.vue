<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
const searchStore = useSearchStore()
const show = computed(() => layoutStore.isOpen('sidebar'))

const { word } = storeToRefs(searchStore)
const keycut = computed(() => navigator?.userAgent.includes('Mac OS') ? '⌘K' : 'Ctrl+K')
</script>

<template>
<BlogMask
	v-model:show="show"
	class="mobile-only"
	@click="layoutStore.toggle('sidebar')"
/>

<!-- 不能用 Transition 实现弹出收起动画，因为半宽屏状态始终显示 -->
<aside id="blog-sidebar" :class="{ show }">
	<BlogHeader class="sidebar-header" to="/" />

	<nav class="sidebar-nav scrollcheck-y">
		<div class="search-btn sidebar-nav-item gradient-card" @click="layoutStore.toggle('search')">
			<Icon name="ph:magnifying-glass-bold" />
			<span class="nav-text">{{ word || '搜索' }}</span>
			<span class="keycut widescreen-only">{{ keycut }}</span>
		</div>

		<template v-for="(group, groupIndex) in appConfig.nav" :key="groupIndex">
			<h3 v-if="group.title">
				{{ group.title }}
			</h3>

			<menu>
				<li v-for="(item, itemIndex) in group.items" :key="itemIndex">
					<UtilLink :to="item.url" class="sidebar-nav-item" @click="layoutStore.toggle('sidebar')">
						<Icon :name="item.icon" />
						<span class="nav-text">{{ item.text }}</span>
						<Icon v-if="isExtLink(item.url)" class="external-tip" name="ph:arrow-up-right" />
					</UtilLink>
				</li>
			</menu>
		</template>
	</nav>

	<footer class="sidebar-footer">
		<BlogThemeToggle />
		<ZIconNavList :list="appConfig.footer.iconNav" />
	</footer>
</aside>
</template>

<style lang="scss" scoped>
#blog-sidebar {
	display: flex;
	flex-direction: column;
	color: var(--c-text-2);

	&:hover {
		color: currentcolor;
	}

	@media (max-width: $breakpoint-mobile) {
		position: fixed;
		left: 0;
		width: 320px;
		max-width: 100%;
		background-color: var(--ld-bg-blur);
		backdrop-filter: blur(0.5rem);
		color: currentcolor;
		transform: translateX(-100%);
		transition: transform 0.2s;
		z-index: var(--z-index-popover);

		&.show {
			box-shadow: 0 0 1rem var(--ld-shadow);
			transform: none;
		}
	}
}

.sidebar-nav {
	flex-grow: 1;
	padding: 0 5%;
	font-size: 0.9em;

	h3 {
		margin: 2em 0 1em 1em;
		font: inherit;
		color: var(--c-text-2);
	}

	li {
		margin: 0.5em 0;
	}
}

.sidebar-nav-item {
	display: flex;
	align-items: center;
	gap: 0.625em;
	padding: 0.75em 1.25em;
	border-radius: 12px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	background: linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg-card) 100%);
	border: 1px solid var(--c-border);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	position: relative;
	overflow: hidden;

	
	&:hover {
		background: linear-gradient(135deg, rgba(var(--c-primary-rgb), 0.1) 0%, rgba(var(--c-primary-rgb), 0.05) 100%);
		color: var(--c-text);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(var(--c-primary-rgb), 0.1);
	}

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(var(--c-primary-rgb), 0.1), transparent);
		transition: left 0.6s ease;
	}

	&:hover::before {
		left: 100%;
	}

	&.router-link-active {
		background: linear-gradient(135deg, rgba(var(--c-primary-rgb), 0.15) 0%, rgba(var(--c-primary-rgb), 0.08) 100%);
		color: var(--c-primary);
		box-shadow: 0 2px 8px rgba(var(--c-primary-rgb), 0.15);
		font-weight: 600;
		position: relative;
		overflow: hidden;
	}

	&.router-link-active::before {
		content: "";
		position: absolute;
		left: 0;
		width: 3px;
		height: 100%;
		background: var(--c-primary);
		transform: scaleY(1);
		transform-origin: center center;
		transition: transform 0.3s ease-out;
	}

	&.router-link-active::after {
		content: "•";
		width: 1em;
		text-align: center;
		color: var(--c-primary);
		font-weight: bold;
		font-size: 1.4em;
		margin-left: 2px;
	}

	&:not(.router-link-active)::before {
		transform: scaleY(0);
		transform-origin: center center;
		transition: transform 0.2s ease-in;
	}

	.iconify {
		font-size: 1.5em;
	}

	.nav-text {
		flex-grow: 1;
	}

	.external-tip {
		opacity: 0.5;
		font-size: 1em;
	}
}



.search-btn {
	margin: 1rem 0;
	outline: 1px solid var(--c-border);
	outline-offset: -1px;
	cursor: text;

	&:hover {
		outline-color: transparent;
		background-color: transparent;
	}

	.nav-text {
		opacity: 0.5;
	}

	.keycut {
		opacity: 0.5;
		padding: 0 0.2em;
		border-radius: 0.2em;
		background-color: var(--c-bg-soft);
		font-size: 0.8em;
	}
}

.sidebar-footer {
	--gap: clamp(0.5rem, 3vh, 1rem);

	display: grid;
	gap: var(--gap);
	padding: var(--gap);
	font-size: 0.8em;
	text-align: center;
	color: var(--c-text-2);
}
</style>
