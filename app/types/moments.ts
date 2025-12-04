export interface MomentItem {
	id: string
	author?: { name: string, avatar: string, badges?: string[] }
	content: string
	images?: string[]
	location?: string
	createdAt: string
	tags?: string[]
	github?: string | { name: string, description: string, url: string, stars?: number }
	videos?: {
		type: 'bilibili' | 'youtube' | 'raw'
		id: string
		autoplay?: boolean
		poster?: string
		ratio?: string | number
		width?: string
	}[]
	music?: {
		server: 'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu' | 'kuwo'
		type: 'song' | 'album' | 'playlist' | 'search'
		id: string | number
		/** 如果你想固定歌名/封面，可传；否则 Meting 会自动拉取 */
		name?: string
		cover?: string
		/** 播放器尺寸，默认 mini 模式 */
		mode?: 'mini' | 'circulation' | 'random' | 'single' | 'order'
		autoplay?: boolean
		theme?: string
	}[]
	url?: string | string[]
	urlCard?: {
		title: string
		description?: string
		icon?: string
	}
}
