import type { Nav, NavItem } from '~/types/nav'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'

// 图标查询：https://yesicon.app/ph?s=bold
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,

	component: {
		alert: {
			/** 默认使用卡片风格还是扁平风格 */
			defaultStyle: 'card' as 'card' | 'flat',
		},

		codeblock: {
			/** 代码块触发折叠的行数 */
			triggerRows: 32,
			/** 代码块折叠后的行数 */
			collapsedRows: 16,
			/** 启用代码块缩进导航会关闭空格渲染 */
			enableIndentGuide: true,
			/** 代码块缩进导航(Indent Guige)竖线匹配空格数 */
			indent: 4,
			/** tab渲染宽度 */
			tabSize: 3,
		},

		/** 文章开头摘要 */
		excerpt: {
			animation: true,
			caret: '_',
		},

		stats: {
			/** 归档页面每年标题对应的年龄 */
			birthYear: 2005,
			/** blog-stats widget 的预置文本 */
			wordCount: '约10万',
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: `© ${new Date().getFullYear()} ${blogConfig.author.name}`,
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '个人主页', url: blogConfig.author.homepage },
			{ icon: 'ri:qq-line', text: '交流群: 169994096', url: 'https://jq.qq.com/?_wv=1027&k=lQfNSeEd' },
			{ icon: 'ph:github-logo-bold', text: 'GitHub: mcyzsx', url: 'https://github.com/mcyzsx' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/' },
		] satisfies NavItem[],
		/** 页脚站点地图 */
		nav: [
			{
				title: '探索',
				items: [
					{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
					{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/' },
				],
			},
			{
				title: '社交',
				items: [
					{ icon: 'ph:github-logo-bold', text: 'mcyzsx', url: 'https://github.com/mcyzsx' },
					{ icon: 'ri:qq-line', text: '群: 169994096', url: 'https://qm.qq.com/q/Ha1GZQtMgE' },
					{ icon: 'ph:envelope-simple-bold', text: blogConfig.author.email, url: `mailto:${blogConfig.author.email}` },
				],
			},
			{
				title: '信息',
				items: [
					{ icon: 'simple-icons:nuxtdotjs', text: `主题: Clarity ${version}`, url: 'https://github.com/L33Z22L11/blog-v3' },
					// { icon: 'ph:swatches-bold', text: '主题和组件文档', url: 'https://blog.zhilu.cyou/theme' },
					// { icon: 'ph:certificate-bold', text: '陕ICP备2025082251号', url: 'https://beian.miit.gov.cn/' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: '/image/avatar.webp',
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['📄', '🦌', '🙌', '🐟', '🏖️'],
		avatarFrame: '/image/touxiangkuang.png',
	},

	/** 友链页面 */
	link: {
		/** 无订阅源展示静音图标 */
		remindNoFeed: true,
		/** 友链分组内随机排序 */
		randomInGroup: true,
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '文章', url: '/' },
				{ icon: 'ph:archive-bold', text: '归档', url: '/archive' },
				{ icon: 'ph:link-bold', text: '友链', url: '/link' },
				{ icon: 'mdi:wechat', text: '朋友圈', url: '/fcircle' },
				{ icon: 'mdi:pen', text: '即刻短文', url: '/moments' },
				{ icon: 'ph:devices-bold', text: '装备', url: '/devices' },
				{ icon: 'icon-park-twotone:message', text: '留言板', url: '/message' },
				{ icon: 'material-symbols:weather-hail-outline', text: '每日天气', url: '/weather' },
				{ icon: 'typcn:news', text: '60S看世界', url: '/news' },
				{ icon: 'ant-design:bilibili-outlined', text: 'B站热门', url: '/bilibili' },
				{ icon: 'mdi:steam', text: 'Steam活动', url: '/steam'},
				{ icon: 'ri:bilibili-fill', text: '追番', url: '/banguim' },
				{ icon: 'simple-icons:githubsponsors', text: '赞助', url: '/sponsor' },
				{ icon: 'tabler:user', text: '关于我', url: '/about' },
			],
		},
	] satisfies Nav,

	other: {
		Themes_Info: 'Clarity',
		Themes_Version: `${version}`,
	},

	analytics: {
		/** Umami 统计数据接口（例如 Cloudflare Worker 提供的聚合 JSON 地址） */
		umamiStatsApi: '',
	},

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as keyof typeof blogConfig.article.order,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	stats: {
		/** 归档页面每年标题对应的年龄 */
		birthYear: 2005,
		/** blog-stats widget 的预置文本 */
		wordCount: '约10万',
	},

	// 主题色配置
	theme: {
		primary: '#2c8edd',
		secondary: '#357abd',
		accent: '#fae386',
	},

	themes: {
		light: {
			icon: 'ph:sun-bold',
			tip: '浅色模式',
		},
		system: {
			icon: 'ph:monitor-bold',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ph:moon-bold',
			tip: '深色模式',
		},
	},
})
