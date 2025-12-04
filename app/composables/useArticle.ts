import type ArticleProps from '~/types/article'
import type { ArticleOrderType } from '~/types/article'
import { alphabetical } from 'radash'

/* 1. 仅内部拉数据，外部永远拿到「纯数组」 */
export function useArticleIndexOptions(path = 'posts/%') {
	const { data } = useAsyncData(
		`idx_${path.replace(/[^a-z0-9]/gi, '_')}`,
		() =>
			queryCollection('content')
				.where('stem', 'LIKE', path)
				.select('categories', 'date', 'description', 'image', 'path', 'readingTime', 'recommend', 'title', 'type', 'updated', 'tags')
				.all(),
		{ default: () => [] },
	)
	// ✅ 直接返回数组，ref 不会泄漏
	return readonly(data) // 只读，防止外部改
}

/* 2. 分类 & 标签 & 排序 & 过滤器 保持原有逻辑即可 */
interface UseCategoryOptions { bindQuery?: string | false }
export function useCategory(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseCategoryOptions) {
	const { bindQuery } = options ?? {}
	const category = bindQuery
		? useRouteQuery(bindQuery, undefined, { transform: (v?: string) => v, mode: 'push' })
		: ref<string | undefined>()
	const categories = computed(() => [...new Set(toValue(list).map(item => item.categories?.[0]).filter(Boolean))])
	const listCategorized = computed(() => toValue(list).filter(item => !category.value || item.categories?.[0] === category.value))
	return { category, categories, listCategorized }
}

interface UseTagOptions { bindQuery?: string | false }
export function useTag(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseTagOptions) {
	const { bindQuery } = options ?? {}
	const tag = bindQuery
		? useRouteQuery(bindQuery, undefined, { transform: (v?: string) => v, mode: 'push' })
		: ref<string | undefined>()
	const tags = computed(() => [...new Set(toValue(list).flatMap(item => item.tags || []))].filter(Boolean))
	const listTagged = computed(() => toValue(list).filter(item => !tag.value || (item.tags && item.tags.includes(tag.value))))
	return { tag, tags, listTagged }
}

interface UseArticleSortOptions { bindDirectionQuery?: string, bindOrderQuery?: string, initialAscend?: boolean, initialOrder?: ArticleOrderType }
export function useArticleSort(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseArticleSortOptions) {
	const appConfig = useAppConfig()
	const { bindDirectionQuery, bindOrderQuery, initialAscend = false, initialOrder = appConfig.pagination.sortOrder || 'date' } = options ?? {}
	const sortOrder = bindOrderQuery ? useRouteQuery(bindOrderQuery, initialOrder) : ref<ArticleOrderType>(initialOrder)
	const isAscending = bindDirectionQuery
		? useRouteQuery(bindDirectionQuery, String(initialAscend), { transform: { get: v => v === 'true', set: v => String(v) } })
		: ref<boolean>(initialAscend)
	const listSorted = computed(() => alphabetical(toValue(list), item => item[sortOrder.value] || '', isAscending.value ? 'asc' : 'desc'))
	return { sortOrder, isAscending, listSorted }
}

export function getCategoryIcon(category?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.categories[category!]?.icon ?? 'ph:folder-bold'
}
export function getTagIcon(tag?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.tags[tag!]?.icon ?? 'ph:tag-bold'
}
export function useArticleFilter(list: MaybeRefOrGetter<ArticleProps[]>, options?: { categoryBindQuery?: string | false, tagBindQuery?: string | false }) {
	const { categoryBindQuery, tagBindQuery } = options ?? {}
	const { category, categories, listCategorized } = useCategory(list, { bindQuery: categoryBindQuery })
	const { tag, tags, listTagged } = useTag(listCategorized, { bindQuery: tagBindQuery })
	const listFiltered = computed(() => toValue(listTagged))
	return { category, categories, tag, tags, listFiltered }
}
export function getPostTypeClassName(type = 'tech', options: { prefix?: string } = {}) {
	return `${options.prefix ?? 'text'}-${type}`
}
