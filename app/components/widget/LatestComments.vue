<script setup lang="ts">
interface Comment {
	content: string
	author: string
	date: string
	avatar: string
	isAdmin: boolean
	url: string
	id: string
}

// Twikoo API 返回数据接口
interface TwikooResponse {
	data: Array<{
		nick: string
		comment: string
		created: number
		avatar: string
		mailMd5: string
		url: string
		id: string
	}>
}

// API 配置常量
const API_URL = 'https://twikoo-ryu.mcyzsx.top'
const ADMIN_EMAIL_MD5 = '4af23c7f41b48fb0475c644485930ede'

// 状态管理
const commentsState = useState('latestComments', () => ({
	comments: [] as Comment[],
	loading: true,
	error: false,
	lastFetchTime: 0,
}))

const comments = computed(() => commentsState.value.comments)
const loading = computed(() => commentsState.value.loading)
const error = computed(() => commentsState.value.error)

function formatTimeAgo(timestamp: number): string {
	const units = [
		{ max: 60, text: '刚刚' },
		{ max: 3600, div: 60, unit: '分钟前' },
		{ max: 86400, div: 3600, unit: '小时前' },
		{ max: 604800, div: 86400, unit: '天前' },
	]

	const diff = Math.floor((Date.now() - timestamp) / 1000)
	const match = units.find(unit => diff < unit.max)
	if (match) {
		return match.div !== undefined
			? `${Math.floor(diff / match.div)}${match.unit}`
			: match.text
	}

	return `${new Intl.DateTimeFormat('zh-CN', {
		month: 'numeric',
		day: 'numeric',
	}).format(timestamp)}日`
}

function formatContent(content: string): string {
	if (!content) {
		return ''
	}

	const replacements = {
		'<pre><code>[\\s\\S]*?</code></pre>': '[代码块]',
		'<code>([^<]{4,})</code>': '[代码]',
		'<code>([^<]{1,3})</code>': '$1',
		'<img(?![^>]*class="tk-owo-emotion")[^>]*>': '[图片]',
		'<a[^>]*?>[\\s\\S]*?</a>': '[链接]',
		'<(?!img[^>]*class="tk-owo-emotion")[^>]+>': '',
	}

	return Object.entries(replacements).reduce(
		(text, [pattern, replacement]) =>
			text.replace(new RegExp(pattern, 'g'), replacement),
		content,
	).trim()
}

async function fetchComments(force = false) {
	// 如果距离上次获取时间小于10分钟且不是强制刷新，则使用缓存
	const now = Date.now()
	if (!force && now - commentsState.value.lastFetchTime < 10 * 60 * 1000) {
		return
	}

	try {
		commentsState.value.loading = true
		commentsState.value.error = false

		const response = await $fetch<TwikooResponse>(API_URL, {
			method: 'POST',
			body: {
				event: 'GET_RECENT_COMMENTS',
				includeReply: true,
				pageSize: 10,
			},
			timeout: 10000, // 增加超时时间
		})

		if (!response?.data) {
			throw new Error('No data received from API')
		}

		commentsState.value.comments = response.data
			.filter(item => item.url !== '/')
			.slice(0, 5)
			.map(item => ({
				content: formatContent(item.comment),
				author: item.nick,
				date: formatTimeAgo(item.created),
				avatar: item.avatar,
				isAdmin: item.mailMd5 === ADMIN_EMAIL_MD5,
				url: item.url,
				id: item.id,
			}))
		commentsState.value.lastFetchTime = now
	}
	catch (err) {
		// 添加更详细的错误处理
		console.error('Failed to fetch latest comments:', err)
		commentsState.value.error = true
	}
	finally {
		commentsState.value.loading = false
	}
}

let timer: number | undefined

// 使用 onBeforeMount 替代 onMounted，确保更早地发起请求
onBeforeMount(() => {
	// 在服务器端渲染时不执行
	if (process.client) {
		fetchComments(true) // 强制首次加载
	}
})

onMounted(() => {
	// 确保 onBeforeMount 中的请求没有执行（比如 SSR 情况）
	if (!commentsState.value.comments.length && !commentsState.value.loading) {
		fetchComments(true)
	}
	
	// 设置定期更新
	timer = window.setInterval(() => fetchComments(), 10 * 60 * 1000)
})

onUnmounted(() => {
	if (timer)
		clearInterval(timer)
})
</script>

<template>
<BlogWidget>
	<template #title>
		<span class="title">最新评论</span>
		<Icon name="ph:chat-circle-text-bold" />
	</template>

	<div class="comment-wrap">
		<Transition name="fade" mode="out-in">
			<!-- 加载中 -->
			<div v-if="loading" class="state-box">
				<div class="spinner" />
				<p>加载中…</p>
			</div>

			<!-- 出错 -->
			<div v-else-if="error" class="state-box">
				<Icon name="line-md:alert" class="error-icon" />
				<span>评论加载失败</span>
				<button class="retry-btn" @click="fetchComments(true)">
					<Icon name="ph:arrow-clockwise" />
					重试
				</button>
			</div>

			<!-- 列表 -->
			<ul v-else class="comment-list">
				<li
					v-for="c in comments"
					:key="c.id"
					class="comment-item"
					@click="navigateTo(`${c.url}#${c.id}`)"
				>
					<div class="meta">
						<div class="left">
							<img :src="c.avatar" :alt="c.author" class="avatar">
							<span class="nick">{{ c.author }}</span>
							<Icon
								v-if="c.isAdmin"
								name="ph:seal-check-fill"
								class="badge"
							/>
						</div>
						<time class="date">{{ c.date }}</time>
					</div>
					<p class="content" v-html="c.content" />
				</li>
			</ul>
		</Transition>
	</div>
</BlogWidget>
</template>

<style lang="scss" scoped>
/* 统一用你已有的变量，无需额外定义 */
.comment-wrap {
	min-height: 280px;          /* 与目录保持一致 */
	padding: 0.6rem 0;
}

.state-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: 220px;
	font-size: 0.9em;
	color: var(--c-text-2);

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--c-bg-3);
		border-top-color: var(--c-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.error-icon {
		font-size: 2rem;
		color: var(--c-red);
	}
	
	.retry-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		padding: 6px 12px;
		background: var(--c-bg-soft);
		border: 1px solid var(--c-border);
		border-radius: 6px;
		color: var(--c-text-1);
		cursor: pointer;
		font-size: 0.85em;
		transition: all 0.2s;
		
		&:hover {
			background: var(--c-bg-card);
			border-color: var(--c-primary);
			color: var(--c-primary);
		}
	}
}

.comment-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.comment-item {
	padding: 0.75rem 0.6rem;
	border-radius: 8px;
	transition: background 0.2s;
	cursor: pointer;

	& + .comment-item {
		margin-top: 4px;
	}

	&:hover {
		background: var(--c-bg-soft);
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
		font-size: 0.82em;
	}

	.left {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.avatar {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		object-fit: cover;
	}

	.nick {
		font-weight: 500;
		color: var(--c-text-1);
	}

	.badge {
		font-size: 1em;
		color: var(--c-primary);
	}

	.date {
		white-space: nowrap;
		color: var(--c-text-3);
	}

	.content {
		overflow: hidden;
		margin: 0;
		font-size: 0.9em;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--c-text-2);

		/* 表情大小统一 */
		:deep(img.tk-owo-emotion) {
			width: 16px;
			height: 16px;
			margin: 0 2px;
			vertical-align: text-bottom;
		}
	}
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

/* 复用目录的过渡 */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s; }

.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>