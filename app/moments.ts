import type { MomentItem } from '@/types/moments'

export function useMoments(): MomentItem[] {
	return [
		{
			id: '2',
			content: '一条带标签、GitHub 仓库、视频的**日记**',
			location: '南京',
			createdAt: '2025-11-30 19:43:00',
			tags: ['日常', '开源'],
			github: 'L33Z22L11/blog-v3',
			videos: [
				{ type: 'bilibili' as const, id: 'BV1h5QaY5EaH', ratio: 16 / 9 },
				// { type: 'raw' as const, id: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: 'https://picsum.photos/seed/123/640/360', ratio: 1.6, width: '480px' },
			],
			music: [
				{
					server: 'netease',
					type: 'song',
					id: '1957502053', // 替换为你想要的歌曲 ID
				},
			],
			url: 'https://blog.zhilu.site/',
			urlCard: {
				title: '纸鹿摸鱼处',
				description: '纸鹿至麓不知路，支炉制露不止漉',
				icon: 'https://www.zhilu.site/api/avatar.png',
			},
		},
		{
			id: '1',
			content: '测试',
			createdAt: '2025-11-29 10:00:00',
		},
	].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
