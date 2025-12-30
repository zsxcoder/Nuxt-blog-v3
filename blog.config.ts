import type { FeedEntry } from './app/types/feed'

export { zhCN as dateLocale } from 'date-fns/locale/zh-CN'

const basicConfig = {
	title: 'ZSXの小站',
	subtitle: '造化钟神秀，阴阳割昏晓。',
	// 长 description 利好于 SEO
	description: '钟神秀的个人博客，我在这里分享我的生活日常、踩坑记录和资源分享。',
	headerConfig: {
		defaultTag: '资源分享者',
		hoverTag: '小说爱好者',
		hoverSubtitle: '每一段旅行都有终点~——”龙泽尔·爱德华',
	},
	author: {
		name: '钟神秀',
		avatar: 'https://gravatar.mcyzsx.top/avatar/me',
		email: 'me@mcyzsx.top',
		homepage: 'https://home.mcyzsx.top/',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: '/image/avatar.webp',
	language: 'zh-CN',
	timeEstablished: '2025-11-28',
	timeStart: '2025',
	timezone: 'Asia/Shanghai',
	url: 'https://blog.zsxcoder.top/',
	defaultCategory: '未分类',
}

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	announcement: {
		enabled: true,
		message: '欢迎来到我的<strong>博客</strong>！<br>如果网站有什么问题，优先<kbd>CTRL</kbd>+<kbd>F5</kbd>刷新一下~<br>如果你还有什么问题和建议，优先通过<a href="mailto:me@mcyzsx.top" target="_blank" rel="noopener noreferrer">邮件</a>联系我~',
	},

	article: {
		categories: <{ [category: string]: { icon: string, color?: string } }>{
			经验分享: { icon: 'ph:mouse-bold', color: '#3af' },
			杂谈: { icon: 'ph:chat-bold', color: '#3ba' },
			生活: { icon: 'ph:shooting-star-bold', color: '#f77' },
			资源分享: { icon: 'mdi:web', color: '#24d' },
			技术分享: { icon: 'ph:code-bold', color: '#77f' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		defaultTagIcon: 'ph:tag-bold',

		tags: <{ [tag: string]: { icon: string, color?: string } }>{
			资源分享: { icon: 'lucide:tool-case', color: '#3DDC84' }, // 绿色 - Android品牌色
			markdown语法: { icon: 'material-icon-theme:markdown', color: 'rgba(68, 186, 255, 1)' }, // 红色 - Markdown品牌色
			教程: { icon: 'mdi:book-open-blank-variant', color: '#FF9800' }, // 橙色 - 教程品牌色
			Git: { icon: 'mdi:git', color: '#F05032' }, // 橙红色 - Git品牌色
			评论: { icon: 'mdi:comment-multiple-outline', color: '#4CAF50' }, // 绿色 - 评论品牌色
			说说: { icon: 'mdi:comment-text-outline', color: '#9C27B0' }, // 紫色 - 说说品牌色
			文件分享: { icon: 'mdi:folder-upload-outline', color: '#2196F3' }, // 蓝色 - 文件分享品牌色
			音乐播放器: { icon: 'mdi:music-circle-outline', color: '#E91E63' }, // 粉色 - 音乐播放器品牌色
			网站推荐: { icon: 'mdi:web', color: '#FF5722' }, // 深橙色 - 网站推荐品牌色
			博客: { icon: 'fa7-solid:blog', color: '#673AB7' }, // 深紫色 - 博客品牌色
			网站统计: { icon: 'mdi:chart-bar', color: '#00BCD4' }, // 蓝绿色 - 网站统计品牌色
			其他: { icon: 'mdi:file-document-box', color: '#FFEB3B' }, // 黄色 - 其他品牌色
		},
		/** 文章版式，首个为默认版式 */
		types: {
			tech: {},
			story: {},
		},
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: ['/preview', '/previews/*'],
	},

	/** 博客 Atom 订阅源 */
	feed: {
		/** 订阅源最大文章数量 */
		limit: 50,
		/** 订阅源是否启用XSLT样式 */
		enableStyle: true,
	},

	/** 向 <head> 中添加脚本 */
	scripts: [
		// 自己部署的 Umami 统计服务
		{ 'src': 'https://umami.mcyzsx.top/script.js', 'data-website-id': '5acc585d-e09a-49ad-97ea-d0cb9f0b222f', 'defer': true },
		// 自己网站的 Cloudflare Insights 统计服务
		// { 'src': 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "97a4fe32ed8240ac8284e9bffaf03962"}', 'defer': true },
		// Twikoo 评论系统
		{ src: 'https://lib.baomitu.com/twikoo/1.6.44/twikoo.min.js', defer: true },
		{
			src: '/js/netease-mini-player-v2.js',
			defer: true,
		},
		{ src: 'https://sdk.jinrishici.com/v2/browser/jinrishici.js', defer: true },
	],
	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: 'https://twikoo-ryu.mcyzsx.top/',
		preload: 'https://twikoo-ryu.mcyzsx.top/',
	},

}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: '友人帐',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'Vercel'],
	date: blogConfig.timeEstablished,
	// comment: '这是我自己',
}

export default blogConfig
