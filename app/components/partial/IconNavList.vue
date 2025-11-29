<script setup lang="ts">
import type { NavItem } from '~/types/nav'

defineProps<{
	list: NavItem[]
}>()
</script>

<template>
<menu>
	<UtilLink
		v-for="{ text, icon, url } in list"
		:key="text"
		v-tip="text"
		:to="url"
		:aria-label="text"
	>
		<Icon :name="icon" />
	</UtilLink>
</menu>
</template>

<style lang="scss" scoped>
.icon-nav-container {
	width: 100%;
	padding: 0.5rem;
}

.icon-nav-menu {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
	align-items: center;
}

.icon-nav-item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem;
	border-radius: 10px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	background: linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg-card) 100%);
	border: 1px solid var(--c-border);
	
	&:hover {
		background: rgba(var(--c-primary-rgb), 0.1);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(var(--c-primary-rgb), 0.1);
	}

	&:active {
		transform: translateY(0);
	}
}

.icon-nav-icon {
	font-size: 1.4em;
	color: var(--c-text-1);
	flex-shrink: 0;
	transition: color 0.3s ease;
	
	.icon-nav-item:hover & {
		color: var(--c-primary);
	}
}

.icon-nav-text {
	display: none;
}

// 响应式设计
@media (max-width: $breakpoint-mobile) {
	.icon-nav-menu {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}
	
	.icon-nav-item {
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		min-width: 80px;
		text-align: center;
	}
	
	.icon-nav-text {
		font-size: 0.8em;
	}
}

// 深色模式适配
.dark {
	.icon-nav-item {
		background-color: var(--c-bg-2);
		border-color: var(--c-border-dark);
		
		&:hover {
			background-color: var(--c-primary-dark);
			border-color: var(--c-primary);
		}
	}
}
</style>
