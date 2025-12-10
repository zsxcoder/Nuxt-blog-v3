<script setup lang="ts">
import type ArticleProps from '~/types/article'
import { useArticleFilter, useArticleIndexOptions } from '~/composables/useArticle'

const appConfig = useAppConfig()
useSeoMeta({
	title: '预览',
	description: `${appConfig.title}的文章预览。`,
})
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log'])

const previewIndexPath = 'previews/%'
const previewIndexKey = `idx_${previewIndexPath.replace(/[^a-z0-9]/gi, '_')}`

const { data: listRawData } = await useAsyncData<ArticleProps[]>(
	previewIndexKey,
	() => useArticleIndexOptions(previewIndexPath),
	{ default: () => [] },
)

const listRaw = computed<ArticleProps[]>(() => listRawData.value || [])

const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw)
const { category, categories, tag, tags, listFiltered } = useArticleFilter(listSorted)
</script>

<template>
<div class="preview">
	<div class="preview-header">
		<h1>
			<UtilLink class="mobile-only" to="/" title="返回首页">
				<Icon name="ph:caret-left-bold" />
			</UtilLink>预览
		</h1>
		<div class="filter-group">
			<PostOrderToggle
				v-model:is-ascending="isAscending"
				v-model:sort-order="sortOrder"
				v-model:category="category"
				:categories
			/>

			<ZTagToggle
				v-model:tag="tag"
				:tags
			/>
		</div>
	</div>
	<p>勇敢的人探索世界。这里是一些还未发布的文章。</p>

	<menu class="proper-height">
		<PostArticle
			v-for="article in listFiltered"
			:key="article.path"
			v-bind="article"
			:to="article.path"
			:use-updated="sortOrder === 'updated'"
		/>
	</menu>
</div>
</template>

<style lang="scss" scoped>
.preview {
	margin: 1rem;
}

.preview-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	h1 {
		mask-image: linear-gradient(#FFF, transparent);
	}
}

.filter-group {
	display: flex;
	align-items: center;
	gap: 1rem;
}
</style>
