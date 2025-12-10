export interface aboutConnect {
	author: author[] // 头像数据
	large: string // 标题数据
	myinfo: myinfo[] // 个人介绍数据
	hello: string // Hello there数据
	maxim: maxim[] // 左右铭数据
	technology: technology[] // 偏好数据
	game: game[] // 游戏数据
	single: single[] // 历程数据
	social: social[]
}

// 头像数据
export interface author {
	left: left[]
	logo: string
	// box: box[];
	right: right[]
}

export interface left {
	tag1: string
	tag2: string
	tag3: string
	tag4: string
}

export interface box {
	logo: string
}

export interface right {
	tag1: string
	tag2: string
	tag3: string
	tag4: string
}

// 个人介绍数据
export interface myinfo {
	title1: string
	title2: string
	inlineword1: string
	title3: string
	inlineword2: string
	card: card[]
}

export interface card {
	tips: string
	conect1: string
	conect2: string
	inlineword: string
	mask: mask[]
}

export interface mask {
	firstTips: string
	span: string
	up: string
	show: string
}

// 左右铭数据
export interface maxim {
	tip: string
	title1: string
	title2: string
}

// 偏好数据
export interface technology {
	tip: string
	title: string
	bottomTip: string
}

// 游戏数据
export interface game {
	tip: string
	title: string
	uid: string
	image: string
}

// 历程数据
export interface single {
	tip: string
	title: string
	lishi: string
	content: string
}

// 社交数据
export interface social {
	href: string
	class: string
	name: string
}

export const about: aboutConnect[] = [
	{
		author: [{
			left: [{
				tag1: '💻 博客写作者',
				tag2: '🥣 干饭魂 干饭人',
				tag3: '🕊 咕咕咕咕咕咕~',
				tag4: '⚒️ 自动化技术专业',
			}],
			logo: 'https://gravatar.mcyzsx.top/avatar/me',
			right: [{
				tag1: '吃饭不如碎觉 💤',
				tag2: '乐观 积极 向上 🤝',
				tag3: '活到老，学到老 🔨',
				tag4: '空闲分享资源和教程 🌐',
			}],
		}],
		large: '关于本站',
		myinfo: [{
			title1: '你好，很高兴认识你👋',
			title2: '我叫',
			inlineword1: '钟神秀',
			title3: '是一名 小说爱好者、学生、',
			inlineword2: '博主',
			card: [{
				tips: '追求',
				conect1: '源于',
				conect2: '热爱而去',
				inlineword: '感受',
				mask: [{
					firstTips: '学习',
					span: '生活',
					up: '博客',
					show: '小说',
				}],
			}],
		}],
		hello: 'Main Dis My Blogs',
		social: [
			{ href: 'https://github.com/mcyzsx', class: 'i-ph:github-logo-bold', name: 'Github' },
			{ href: 'https://t.me/KemiaoJun', class: 'line-md:telegram', name: 'Telegram' },
			{ href: 'https://space.bilibili.com/3546643173477234', class: 'i-meteor-icons:bilibili', name: 'Bilibili' },
			{ href: 'https://x.com/kemiao', class: 'i-iconoir:x', name: 'X' },
			{ href: 'https://qm.qq.com/q/Ha1GZQtMgE', class: 'i-ri:qq-line', name: 'QQ' },
			{ href: 'mailto:me@mcyzsx.top', class: 'i-mdi:email-outline', name: 'Email' },
			{ href: 'https://music.163.com/#/playlist?id=13681647281', class: 'i-ri:netease-cloud-music-line', name: '网易云' },
		],
		maxim: [{
			tip: '座右铭',
			title1: '造化钟神秀，',
			title2: '阴阳割昏晓。',
		}],
		technology: [{
			tip: '关注偏好',
			title: '博客写作及完善',
			bottomTip: '资源分享、小说阅读',
		}],
		game: [{
			tip: '爱好游戏',
			title: '饥荒',
			uid: 'Krylin',
			image: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/bizhi/jihuang.webp',
		}],
		single: [{
			tip: '建站历程',
			title: '魔改建站记录',
			lishi: '『ZSXの小站』的魔改进程',
			content: '『ZSXの小站』的魔改记录',
		}],
	},
]
