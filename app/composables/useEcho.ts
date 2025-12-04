import type { MomentItem } from '~/types/moments'

export interface EchoItem {
	id: number
	content: string
	username: string
	images: { image_url: string }[]
	layout: 'grid' | 'waterfall'
	private: boolean
	user_id: number
	extension?: string
	extension_type?: 'MUSIC' | null
	fav_count: number
	created_at: string
	tags?: { id: number, name: string, usage_count: number, created_at: string }[]
}

export interface EchoList {
	total: number
	items: EchoItem[]
}

/* ===== 自定义昵称 ===== */
const CUSTOM_NAME = '钟神秀' // <--- 想叫啥改这里

/* 把 Echo 字段洗成 MomentItem */
function normalizeEchoToMoment(list: EchoItem[]): MomentItem[] {
	return list.map((it) => {
		/* 1. 音乐 */
		let music: MomentItem['music']
		if (it.extension_type === 'MUSIC' && it.extension) {
			const id = it.extension.match(/\bid=(\d+)/)?.[1]
			if (id)
				music = [{ id, server: 'netease', type: 'song', autoplay: false }]
		}

		/* 2. 图片 */
		const images = it.images.map(i => i.image_url)

		/* 3. 标签 */
		const tags = it.tags?.map(t => t.name) || []

		return {
			id: String(it.id),
			content: it.content,
			createdAt: it.created_at,
			author: {
				name: CUSTOM_NAME, // ← 写死自定义名字
				avatar: 'https://gravatar.mcyzsx.top/avatar/me',
			},
			images,
			music,
			tags,
		}
	})
}

/* 获取原始 Echo 数据（带 30 min 缓存） */
export function useEcho() {
	return useState<EchoItem[]>('echo-list', () => [])
}

export async function fetchEcho(): Promise<EchoItem[]> {
	const cache = useEcho()
	if (cache.value.length)
		return cache.value
	const { data } = await $fetch<EchoList>('https://echo.051531.xyz/api/echo/page')
	cache.value = data.items
	return cache.value
}

/* 给页面用的「洗好」的数据 */
export async function useEchoMoments() {
	const raw = await fetchEcho()
	return normalizeEchoToMoment(raw)
}
