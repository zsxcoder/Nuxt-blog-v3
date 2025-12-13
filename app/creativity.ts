// 定义外层分类的类型接口
export interface CreativityData {
	class_name: string // 分类名称
	subtitle: string
	creativity_list: CreativityItem[] // 创意项列表
}

// 定义最内层创意项的类型接口
export interface CreativityItem {
	name: string // 技术名称
	color: string // 颜色值（十六进制/关键字）
	icon: string // 图标 URL 地址
}

// 具体数据（与 YAML 结构完全对应）
export const creativityData: CreativityData[] = [
	{
		class_name: '开启创造力',
		subtitle: '技能',
		creativity_list: [
			{
				name: 'Vue',
				color: '#b8f0ae',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/Vue.3uvait8kyx.webp',
			},
			{
				name: 'Java',
				color: '#fff',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/java.5c1fkkttn4.webp',
			},
			{
				name: 'Nuxt',
				color: '#59ff00ff',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/nuxt.5j4nbqnu6h.webp',
			},
			{
				name: 'Markdown',
				color: '#4082c3',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/markdown.1apg1xvcq1.webp',
			},
			{
				name: 'PNPM',
				color: '#eb6840',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/pnpm.9kgmq5mfiu.webp',
			},
			{
				name: 'Astro',
				color: '#5c5c5cff',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/astro.1sfhqi4crl.webp',
			},
			{
				name: 'Node',
				color: '#fff',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/Nodejs.7pqvb9wtd.webp',
			},
			{
				name: 'Git',
				color: '#df5b40',
				icon: 'https://imgbed.mcyzsx.top/file/custom/MwCNwosm.svg',
			},
			{
				name: 'Css',
				color: '#2c51db',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/css3.7lkfzsnjgu.webp',
			},
			{
				name: 'Js',
				color: '#f7cb4f',
				icon: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/custom/js.6wr6fs3bs6.webp',
			},
		],
	},
]
