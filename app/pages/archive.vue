<script setup lang="ts">
import type ArticleProps from '~/types/article'
import { onClickOutside } from '@vueuse/core'
import { group } from 'radash'

import { useArticleFilter, useArticleIndexOptions } from '~/composables/useArticle'

const appConfig = useAppConfig()
useSeoMeta({
	title: '归档',
	description: `${appConfig.title}的所有文章归档。`,
})
const birthYear = appConfig.component.stats.birthYear

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log', 'latest-comments', 'comm-group', 'poetry']) // 你的文章类型声明路径

// 1. 取原始数据
const articleIndexPath = 'posts/%'
const articleIndexKey = `idx_${articleIndexPath.replace(/[^a-z0-9]/gi, '_')}`

const { data: listRawData } = await useAsyncData<ArticleProps[]>(
	articleIndexKey,
	() => useArticleIndexOptions(articleIndexPath),
	{ default: () => [] },
)

const listRaw = computed<ArticleProps[]>(() => listRawData.value || [])

// 2. 包成 ComputedRef<ArticleProps[]>
const listNormalized = computed<ArticleProps[]>(() => {
	const raw = listRaw.value
	if (!Array.isArray(raw) || !raw.length)
		return []
	return raw as ArticleProps[]
})

// 3. 再传给 useArticleFilter
const { category, categories, tag, tags, listFiltered } = useArticleFilter(listNormalized, {
	categoryBindQuery: 'category',
	tagBindQuery: 'tag',
})

// 获取分类图标
function getCategoryIcon(category?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.categories[category!]?.icon ?? 'ph:folder-bold'
}

// 获取标签图标
function getTagIcon(tag?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.tags[tag!]?.icon ?? 'ph:tag-bold'
}

const listGrouped = computed(() => {
	if (!listFiltered.value)
		return []

	const groupList = Object.entries(group(
		listFiltered.value,
		article => new Date(article?.date || 0).getFullYear(),
	))

	// 对每个年份内的文章按月份分组
	const result = groupList.map(([year, articles]) => {
		const monthlyGroups = Object.entries(group(
			articles || [],
			article => new Date(article?.date || 0).getMonth() + 1,
		)).map(([month, monthArticles]) => ({
			month: Number.parseInt(month),
			articles: monthArticles || [],
		}))

		// 按月份倒序排序（最新的月份在前）
		monthlyGroups.sort((a, b) => b.month - a.month)

		return {
			year,
			monthlyGroups,
			totalArticles: articles?.length || 0,
		}
	})

	// 按年份倒序排序（最新的年份在前）
	return result.sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
})

// 不能使用 /api/stats，因为可能切换分组方式
const yearlyWordCount = computed(() => {
	return listGrouped.value.reduce<Record<string, string>>((acc, group) => {
		const totalWords = group.monthlyGroups.reduce((sum, monthGroup) => {
			return sum + (monthGroup.articles?.reduce((articleSum, article) =>
				articleSum + (article?.readingTime?.words || 0), 0) || 0)
		}, 0)
		acc[group.year] = formatNumber(totalWords)
		return acc
	}, {})
})

// 折叠状态管理
const expandedYears = ref<Set<string>>(new Set())
const expandedMonths = ref<Set<string>>(new Set())

function toggleYear(year: string) {
	if (expandedYears.value.has(year)) {
		expandedYears.value.delete(year)
	}
	else {
		expandedYears.value.add(year)
	}
}

function toggleMonth(year: string, month: number) {
	const key = `${year}-${month}`
	if (expandedMonths.value.has(key)) {
		expandedMonths.value.delete(key)
	}
	else {
		expandedMonths.value.add(key)
	}
}

const isYearExpanded = (year: string) => expandedYears.value.has(year)
const isMonthExpanded = (year: string, month: number) => expandedMonths.value.has(`${year}-${month}`)

// 下拉菜单状态管理
const isCategoryDropdownOpen = ref(false)
const categoryDropdownRef = ref<HTMLElement | null>(null)
const isTagDropdownOpen = ref(false)
const tagDropdownRef = ref<HTMLElement | null>(null)

function toggleCategoryDropdown() {
	isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
}

function toggleTagDropdown() {
	isTagDropdownOpen.value = !isTagDropdownOpen.value
}

function selectCategory(cat: string | undefined) {
	category.value = cat
	isCategoryDropdownOpen.value = false
}

function selectTag(t: string | undefined) {
	tag.value = t
	isTagDropdownOpen.value = false
}

const currentCategoryLabel = computed(() => {
	return category.value || '全部'
})

const currentTagLabel = computed(() => {
	return tag.value || '全部'
})

// 点击外部关闭下拉菜单
onClickOutside(categoryDropdownRef, () => {
	isCategoryDropdownOpen.value = false
})

onClickOutside(tagDropdownRef, () => {
	isTagDropdownOpen.value = false
})
</script>

<template>
<div class="archive-page">
	<!-- 筛选器组 -->
	<div v-if="(categories && categories.length > 1) || (tags && tags.length > 0)" class="filter-group">
		<!-- 分类筛选 -->
		<div v-if="categories && categories.length > 1" ref="categoryDropdownRef" class="category-dropdown">
			<div
				class="dropdown-trigger"
				:class="{ active: isCategoryDropdownOpen }"
				@click="toggleCategoryDropdown"
			>
				<div class="selected-content">
					<Icon
						:name="!category ? 'ph:folder-bold' : getCategoryIcon(category)"
						class="selected-icon"
					/>
					<span class="selected-category">分类: {{ currentCategoryLabel }}</span>
				</div>
				<Icon
					name="ph:caret-down"
					class="dropdown-icon"
					:class="{ rotated: isCategoryDropdownOpen }"
				/>
			</div>

			<Transition name="dropdown">
				<div
					v-if="isCategoryDropdownOpen"
					class="dropdown-menu"
					@click.stop
				>
					<!-- 全部选项 -->
					<div
						:key="undefined"
						class="dropdown-item" :class="[{ active: !category, selected: !category }]"
						@click="selectCategory(undefined)"
					>
						<div class="category-content">
							<Icon
								name="ph:folder-bold"
								class="category-icon"
							/>
							<span class="category-text">全部</span>
						</div>
						<Icon
							v-if="!category"
							name="ph:check"
							class="check-icon"
						/>
					</div>

					<!-- 分类选项 -->
					<div
						v-for="cat in categories"
						:key="cat"
						class="dropdown-item" :class="[{ active: category === cat, selected: category === cat }]"
						@click="selectCategory(cat)"
					>
						<div class="category-content">
							<Icon
								:name="getCategoryIcon(cat)"
								class="category-icon"
							/>
							<span class="category-text">{{ cat }}</span>
						</div>
						<Icon
							v-if="category === cat"
							name="ph:check"
							class="check-icon"
						/>
					</div>
				</div>
			</Transition>
		</div>

		<!-- 标签筛选 -->
		<div v-if="tags && tags.length > 0" ref="tagDropdownRef" class="category-dropdown">
			<div
				class="dropdown-trigger"
				:class="{ active: isTagDropdownOpen }"
				@click="toggleTagDropdown"
			>
				<div class="selected-content">
					<Icon
						:name="!tag ? 'ph:tag-bold' : getTagIcon(tag)"
						class="selected-icon"
					/>
					<span class="selected-category">标签: {{ currentTagLabel }}</span>
				</div>
				<Icon
					name="ph:caret-down"
					class="dropdown-icon"
					:class="{ rotated: isTagDropdownOpen }"
				/>
			</div>

			<Transition name="dropdown">
				<div
					v-if="isTagDropdownOpen"
					class="dropdown-menu"
					@click.stop
				>
					<!-- 全部选项 -->
					<div
						:key="undefined"
						class="dropdown-item" :class="[{ active: !tag, selected: !tag }]"
						@click="selectTag(undefined)"
					>
						<div class="category-content">
							<Icon
								name="ph:tag-bold"
								class="category-icon"
							/>
							<span class="category-text">全部</span>
						</div>
						<Icon
							v-if="!tag"
							name="ph:check"
							class="check-icon"
						/>
					</div>

					<!-- 标签选项 -->
					<div
						v-for="t in tags"
						:key="t"
						class="dropdown-item" :class="[{ active: tag === t, selected: tag === t }]"
						@click="selectTag(t)"
					>
						<div class="category-content">
							<Icon
								:name="getTagIcon(t)"
								class="category-icon"
							/>
							<span class="category-text">{{ t }}</span>
						</div>
						<Icon
							v-if="tag === t"
							name="ph:check"
							class="check-icon"
						/>
					</div>
				</div>
			</Transition>
		</div>
	</div>

	<div class="archive-groups">
		<section
			v-for="group in listGrouped"
			:key="group.year"
			class="archive-group" :class="[{ expanded: isYearExpanded(group.year) }]"
		>
			<!-- 年份标题栏 -->
			<div class="archive-header" @click="toggleYear(group.year)">
				<div class="archive-title">
					<h2 class="archive-year">
						{{ group.year }}
					</h2>

					<div class="archive-age">
						<span class="age-number">{{ Number(group.year) - birthYear }}</span>
						<span class="age-label">岁</span>
					</div>
				</div>

				<div class="archive-meta">
					<div class="archive-stats">
						<span class="stat-item">{{ yearlyWordCount[group.year] }}字</span>
						<span class="stat-item">{{ group.totalArticles }}篇</span>
					</div>

					<div class="expand-indicator">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</div>
			</div>

			<!-- 月份分类和文章列表 -->
			<Transition name="slide-fade">
				<div v-if="isYearExpanded(group.year)" class="archive-content">
					<div
						v-for="monthGroup in group.monthlyGroups"
						:key="monthGroup.month"
						class="month-section"
					>
						<h3 class="month-title">
							{{ monthGroup.month }}月
						</h3>
						<menu class="archive-list">
							<TransitionGroup appear name="float-in">
								<PostArchive
									v-for="article, index in monthGroup.articles"
									:key="article.path"
									v-bind="article"
									:to="article.path"
									:style="{ '--delay': `${index * 0.03}s` }"
								/>
							</TransitionGroup>
						</menu>
					</div>
				</div>
			</Transition>
		</section>
	</div>
</div>
</template>

<style lang="scss" scoped>
.archive-page {
	padding: 1rem;
	max-width: 1200px;
	margin: 0 auto;
	min-height: 90vh;
	display: flex;
	flex-direction: column;
}

.filter-group {
	display: flex;
	gap: 1rem;
	margin: 2rem 0 0.5rem 0;
	flex-wrap: wrap;
}

.archive-groups {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 0.5rem;
}

.archive-group {
	background: var(--ld-bg-card);
	border: 1px solid var(--c-border);
	border-radius: 12px;
	box-shadow: 0 2px 12px var(--ld-shadow);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		box-shadow: 0 6px 20px var(--ld-shadow);
		transform: translateY(-1px);
	}

	&.expanded {
		box-shadow: 0 8px 25px var(--ld-shadow);
	}
}

.archive-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	user-select: none;
	position: relative;
	border: 2px solid transparent;
	border-radius: 10px;
	box-sizing: border-box;

	&:hover {
		box-shadow: 0 4px 12px var(--ld-shadow);
		transform: translateY(-1px);
		border-color: var(--c-primary);

		.expand-indicator {
			background: var(--c-primary-soft);
			color: var(--c-primary);
		}
	}
}

.archive-title {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex: 1;
}

.archive-year {
	font-size: 1.75rem;
	font-weight: 800;
	color: var(--c-text);
	margin: 0;
	background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.archive-age {
	display: flex;
	align-items: baseline;
	gap: 0.2rem;
	font-size: 1rem;
	font-weight: 600;
	color: var(--c-text-2);
	background: var(--c-bg-soft);
	padding: 0.4rem 0.8rem;
	border-radius: 8px;

	.age-number {
		font-size: 1em;
		line-height: 1;
	}

	.age-label {
		font-size: 0.7em;
		opacity: 0.8;
	}
}

.archive-meta {
	display: flex;
	align-items: center;
	gap: 1.5rem;
}

.archive-stats {
	display: flex;
	gap: 1rem;
	font-size: 0.9rem;
}

.stat-item {
	color: var(--c-text-2);
	font-weight: 500;
	background: var(--c-bg-soft);
	padding: 0.3rem 0.6rem;
	border-radius: 6px;
}

.expand-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 8px;
	background: var(--c-bg-soft);
	color: var(--c-text-2);
	transition: all 0.3s ease;

	.archive-group.expanded & {
		transform: rotate(180deg);
		color: var(--c-primary);
		background: var(--c-primary-soft);
	}
}

.archive-content {
	overflow: hidden;
	padding: 0 1.5rem 1.5rem;
}

.month-section {
	margin-bottom: 1.5rem;

	&:last-child {
		margin-bottom: 0;
	}
}

.month-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: var(--c-text-2);
	margin: 0 0 0.5rem 0;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid var(--c-primary-soft);
}

.archive-list {
	margin: 0;
	padding: 0;
	list-style: none;

	:deep(.article-item) {
		position: relative;
		margin: 0.75rem 0;
		padding: 1rem 1.25rem;
		border-radius: 12px;
		background: var(--c-bg-1);
		border: 1px solid var(--c-border);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 1px 3px var(--ld-shadow);

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(to bottom, var(--c-primary), var(--c-accent));
			border-radius: 12px 0 0 12px;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 25px var(--ld-shadow);
			border-color: var(--c-primary-soft);

			&::before {
				opacity: 1;
			}

			.article-title {
				color: var(--c-primary);
			}

			time {
				background: var(--c-primary-soft);
				color: var(--c-primary);
			}

			.article-link::after {
				transform: translateX(3px);
				opacity: 1;
			}
		}

		.article-link {
			display: grid;
			grid-template-columns: auto 1fr auto;
			align-items: center;
			gap: 1rem;
			text-decoration: none;
			position: relative;
			outline: none;
			background: none !important;

			&:focus {
				outline: none;
				box-shadow: none;
			}

			&::before {
				display: none !important;
			}

			&::after {
				content: '→';
				font-weight: 600;
				color: var(--c-primary);
				opacity: 0;
				transition: all 0.3s ease;
			}
		}

		time {
			font-family: var(--font-monospace);
			font-size: 0.8rem;
			font-weight: 600;
			color: var(--c-text-2);
			background: var(--c-bg-soft);
			padding: 0.4rem 0.8rem;
			border-radius: 8px;
			transition: all 0.3s ease;
			min-width: 4rem;
			text-align: center;
		}

		.article-title {
			font-weight: 600;
			color: var(--c-text);
			font-size: 1rem;
			line-height: 1.4;
			transition: color 0.3s ease;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		// 隐藏封面图片
		.article-cover {
			display: none !important;
		}
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	.archive-list {
		:deep(.article-item) {
			padding: 0.875rem 1rem;
			margin: 0.5rem 0;

			.article-link {
				grid-template-columns: auto 1fr;
				gap: 0.75rem;

				&::after {
					display: none;
				}
			}

			time {
				font-size: 0.75rem;
				padding: 0.3rem 0.6rem;
				min-width: 3.5rem;
				grid-row: 1;
			}

			.article-title {
				font-size: 0.95rem;
				grid-column: 2;
				-webkit-line-clamp: 3;
			}
		}
	}
}

@media (max-width: 480px) {
	.archive-list {
		:deep(.article-item) {
			padding: 0.75rem;

			.article-link {
				grid-template-columns: 1fr;
				gap: 0.5rem;
			}

			time {
				grid-row: 2;
				grid-column: 1;
				justify-self: start;
				font-size: 0.7rem;
				padding: 0.25rem 0.5rem;
			}

			.article-title {
				grid-column: 1;
				font-size: 0.9rem;
			}
		}
	}
}

/* 展开/折叠动画 */
.slide-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.archive-page {
		padding: 0.5rem;
	}

	.archive-header {
		padding: 1rem;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.archive-title {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.archive-year {
		font-size: 1.5rem;
	}

	.archive-meta {
		width: 100%;
		justify-content: space-between;
	}

	.archive-stats {
		gap: 0.75rem;
	}

	.stat-item {
		font-size: 0.8rem;
		padding: 0.25rem 0.5rem;
	}

	.archive-content {
		padding: 0 1rem 1rem;
	}
}

@media (max-width: 480px) {
	.archive-stats {
		flex-direction: column;
		gap: 0.5rem;
	}

	.archive-year {
		font-size: 1.25rem;
	}

	.archive-age {
		font-size: 0.9rem;
		padding: 0.3rem 0.6rem;
	}
}

/* 分类下拉组件样式 */
.category-dropdown {
	position: relative;
	display: inline-block;
	margin-bottom: 1rem;
	z-index: 10;
}

.dropdown-trigger {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	background: var(--c-bg-1);
	border: 1px solid var(--c-border);
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	min-width: 120px;
	user-select: none;
	font-size: 0.875rem;

	&:hover {
		border-color: var(--c-primary);
		box-shadow: 0 2px 8px var(--ld-shadow);
	}

	&.active {
		border-color: var(--c-primary);
		box-shadow: 0 2px 12px var(--c-primary-soft);
	}
}

.selected-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 1;
}

.selected-icon {
	color: var(--c-text-2);
	font-size: 1em;
	flex-shrink: 0;
}

.selected-category {
	font-weight: 500;
	color: var(--c-text);
	font-size: 0.875rem;
}

.dropdown-icon {
	color: var(--c-text-2);
	transition: transform 0.2s ease;
	font-size: 0.875rem;

	&.rotated {
		transform: rotate(180deg);
		color: var(--c-primary);
	}
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: var(--c-bg-1);
	border: 1px solid var(--c-primary);
	border-radius: 8px;
	box-shadow: 0 4px 16px var(--ld-shadow);
	margin-top: 0.25rem;
	overflow: hidden;
	z-index: 1000;
	min-width: 120px;
}

.dropdown-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 0.75rem;
	cursor: pointer;
	transition: all 0.15s ease;
	border-bottom: 1px solid var(--c-border-soft);
	font-size: 0.875rem;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: var(--c-primary-soft);

		.category-text {
			color: var(--c-primary);
		}

		.category-icon {
			color: var(--c-primary);
		}
	}

	&.selected {
		background: var(--c-primary-soft);

		.category-text {
			color: var(--c-primary);
			font-weight: 500;
		}

		.category-icon {
			color: var(--c-primary);
		}
	}
}

.category-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 1;
}

.category-icon {
	color: var(--c-text-2);
	font-size: 1.1em;
	transition: color 0.15s ease;
	flex-shrink: 0;
}

.category-text {
	color: var(--c-text);
	transition: color 0.15s ease;
	font-size: 0.875rem;
	flex: 1;
}

.check-icon {
	color: var(--c-primary);
	font-size: 0.95em;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.category-dropdown {
		width: 100%;
	}

	.dropdown-trigger {
		width: 100%;
		justify-content: space-between;
	}

	.dropdown-menu {
		width: 100%;
		left: 0;
		right: 0;
	}
}
</style>
