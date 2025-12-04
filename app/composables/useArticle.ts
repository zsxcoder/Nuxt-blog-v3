import type ArticleProps from '~/types/article'
import type { ArticleOrderType } from '~/types/article'
import { alphabetical } from 'radash'

// export function useArticleIndex(path = 'posts/%') {
// 	return useAsyncData(
// 		`index_${path}`,
// 		() => queryCollection('content')
// 			.where('stem', 'LIKE', path)
// 			.select('categories', 'date', 'description', 'image', 'path', 'readingTime', 'recommend', 'title', 'type', 'updated', 'tags')
// 			.all(),
// 		{ default: () => [] }, // 不返回 undefined
// 	)
/**
 * 生成文章查询参数，完全包装 useAsyncData 会使 SSR 行为异常，缓存 key 需要暴露
 * @see https://nuxt.com/docs/4.x/api/composables/use-async-data#usage
 * @see https://github.com/nuxt/nuxt/issues/14736
 * @todo 支持分页/分类筛选
 */
export function useArticleIndexOptions(path = 'posts/%') {
	return queryCollection('content')
		.where('stem', 'LIKE', path)
		.select('categories', 'date', 'description', 'image', 'path', 'readingTime', 'recommend', 'title', 'type', 'updated', 'tags')
		.all()
}

interface UseCategoryOptions {
	bindQuery?: string | false
}

export function useCategory(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseCategoryOptions) {
	const { bindQuery } = options ?? {}
	const category = bindQuery
		? useRouteQuery(bindQuery, undefined, { transform: (value?: string) => value, mode: 'push' })
		: ref<string | undefined>()
	const categories = computed(() => [...new Set(toValue(list).map(item => item.categories?.[0]))])
	const listCategorized = computed(
		() => toValue(list).filter(
			item => !category.value || item.categories?.[0] === category.value,
		),
	)

	return {
		category,
		categories,
		listCategorized,
	}
}

interface UseTagOptions {
	bindQuery?: string | false
}

export function useTag(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseTagOptions) {
	const { bindQuery } = options ?? {}
	const tag = bindQuery
		? useRouteQuery(bindQuery, undefined, { transform: (value?: string) => value, mode: 'push' })
		: ref<string | undefined>()
	const tags = computed(() => {
		const allTags = toValue(list).flatMap(item => item.tags || [])
		return [...new Set(allTags)].filter(Boolean)
	})
	const listTagged = computed(
		() => toValue(list).filter(
			item => !tag.value || (item.tags && item.tags.includes(tag.value)),
		),
	)

	return {
		tag,
		tags,
		listTagged,
	}
}

export function useArticleSort(list: MaybeRefOrGetter<ArticleProps[]>, _p0: { bindDirectionQuery: string, bindOrderQuery: string }) {
	const appConfig = useAppConfig()
	const sortOrder = ref<ArticleOrderType>(appConfig.pagination.sortOrder || 'date')
	const isAscending = ref<boolean>()
	const listSorted = computed(() => alphabetical(
		toValue(list),
		item => item[sortOrder.value] || '',
		isAscending.value ? 'asc' : 'desc',
	))
	return {
		sortOrder,
		isAscending,
		listSorted,
	}
}

export function getCategoryIcon(category?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.categories[category!]?.icon ?? 'ph:folder-bold'
}

export function getTagIcon(tag?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.tags[tag!]?.icon ?? 'ph:tag-bold'
}

export function useArticleFilter(list: MaybeRefOrGetter<ArticleProps[]>, options?: {
	categoryBindQuery?: string | false
	tagBindQuery?: string | false
}) {
	const { categoryBindQuery, tagBindQuery } = options ?? {}

	const { category, categories, listCategorized } = useCategory(list, { bindQuery: categoryBindQuery })
	const { tag, tags, listTagged } = useTag(listCategorized, { bindQuery: tagBindQuery })

	const listFiltered = computed(() => toValue(listTagged))

	return {
		category,
		categories,
		tag,
		tags,
		listFiltered,
	}
}

export function getPostTypeClassName(type?: string, options = {
	prefix: 'text',
}) {
	if (!type)
		type = 'tech'

	const { prefix } = options

	return `${prefix}-${type}`
}
