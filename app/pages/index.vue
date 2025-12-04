<script setup lang="ts">
import { sort } from 'radash'
import { useArticleFilter } from '~/composables/useArticle'

const appConfig = useAppConfig()
useSeoMeta({
	description: appConfig.description,
	ogImage: appConfig.author.avatar,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'announcement-card', 'work-status', 'latest-comments', 'comm-group', 'poetry'])

const listRaw = useArticleIndexOptions() // 默认查询 posts/%

const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw, {
	bindDirectionQuery: 'asc',
	bindOrderQuery: 'sort',
})

const { category, categories, tag, tags, listFiltered } = useArticleFilter(listSorted, {
	categoryBindQuery: 'category',
	tagBindQuery: 'tag',
})

const { page, totalPages, listPaged } = usePagination(listFiltered, { bindQuery: 'page' })

watch([category, tag], () => {
	page.value = 1
})

useSeoMeta({ title: () => (page.value > 1 ? `第${page.value}页` : '') })

const listRecommended = computed(() => sort(
	listRaw.value.filter(item => item?.recommend),
	post => post.recommend || 0,
	true,
))
</script>

<template>
<BlogHeader class="mobile-only" to="/" tag="h1" />

<UtilHydrateSafe>
	<PostSlide v-if="listRecommended.length && page === 1 && !category && !tag" :list="listRecommended" />

	<div class="post-list">
		<div class="toolbar">
			<div>
				<!-- 外层元素用于占位 -->
				<UtilLink to="/preview" class="preview-entrance">
					<Icon name="ph:file-lock-bold" />
					查看预览文章
				</UtilLink>
			</div>

			<div class="filter-group">
				<PostOrderToggle
					v-model:is-ascending="isAscending"
					v-model:sort-order="sortOrder"
					v-model:category="category"
					:categories
				/>

				<PostTagToggle
					v-model:tag="tag"
					:tags
				/>
			</div>
		</div>

		<TransitionGroup tag="menu" class="proper-height" name="float-in">
			<PostArticle
				v-for="article, index in listPaged"
				:key="article.path"
				v-bind="article"
				:to="article.path"
				:use-updated="sortOrder === 'updated'"
				:style="{ '--delay': `${index * 0.05}s` }"
			/>
		</TransitionGroup>

		<ZPagination v-model="page" sticky :total-pages="totalPages" />
	</div>
</UtilHydrateSafe>
</template>

<style lang="scss" scoped>
.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.filter-group {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.preview-entrance {
	position: relative;
	opacity: 0;
	transition: all 0.2s 1s, color 0.2s;
	z-index: -1;

	:hover > &,
	:focus-within > & {
		opacity: 1;
		color: var(--c-primary);
		z-index: 0;
	}
}

.post-list {
	margin: 1rem;
}
</style>
