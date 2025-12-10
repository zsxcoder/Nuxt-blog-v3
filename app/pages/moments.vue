<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed, onMounted, ref } from 'vue'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

// 全局配置
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

// 设置侧边栏组件
layoutStore.setAside(['blog-stats', 'blog-tech', 'blog-site-info', 'blog-archive', 'blog-log'])

// SEO 配置
useSeoMeta({
	title: '瞬间',
	ogType: 'profile',
	description: `${appConfig.title}的碎碎念页面，记录生活点滴，一些想法和生活。`,
})

// API 配置常量
const API_CONFIG = {
	MEMO_API: '/api/memo/list',
	USER_API: '/api/user/profile',
	PAGE_SIZE: 30,
}
// ---------- 新增：用户信息状态管理 ----------
interface UserProfile {
	username: string
	nickname: string
	avatarUrl: string
	slogan: string
}
const userState = ref({
	loading: true,
	error: false,
	data: null as UserProfile | null,
})
// 新增：请求用户信息的函数
async function fetchUserProfile() {
	try {
		userState.value.loading = true
		userState.value.error = false

		const data = await $fetch<{ code: number; data?: UserProfile }>(API_CONFIG.USER_API, {
			method: 'POST',
			body: {},
		})
		if (data.code === 0 && data.data) {
			userState.value.data = data.data as UserProfile
		}
	}
	catch (err) {
		console.error('获取用户信息失败：', err)
		userState.value.error = true
	}
	finally {
		userState.value.loading = false
	}
}
// ---------- 新增结束 ----------

// 计算属性 - 用户信息
const user = computed(() => userState.value.data)
const userLoading = computed(() => userState.value.loading)
const userError = computed(() => userState.value.error)

// 加载外部脚本
onMounted(() => {
	const loadScript = (src: string) => {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`script[src="${src}"]`))
				return resolve(null)

			const script = document.createElement('script')
			script.src = src
			script.async = true
			script.onload = resolve
			script.onerror = reject
			document.head.appendChild(script)
		})
	}

	loadScript('https://jsd.myxz.top/npm/aplayer/dist/APlayer.min.js')
		.catch(err => console.error('脚本加载失败:', err))
	loadScript('https://jsd.myxz.top/npm/meting@2/dist/Meting.min.js')
		.catch(err => console.error('脚本加载失败:', err))

	fetchTalks()
	fetchUserProfile()
})

interface TalkItem {
	content: {
		text: string
		images: string[]
		music?: {
			type: 'song' | 'playlist'
			id: string
			server: string
			api: string
		}
		video?: {
			type: 'bilibili' | 'youtube' | 'online'
			url: string
			id?: string
		}
		doubanMovie?: {
			url: string
			title: string
			image: string
			director: string
			rating: string
			runtime: string
		}
		doubanBook?: {
			url: string
			title: string
			image: string
			author: string
			pubDate: string
			rating: string
		}
		externalLink?: {
			url: string
			title: string
			favicon: string
		}
	}
	user: {
		username: string
		nickname: string
		avatarUrl: string
	}
	date: string
	location: string
	tags: string[]
}

// 状态管理
const talksState = useState('essayTalks', () => ({
	talks: [] as TalkItem[],
	loading: true,
	error: false,
	lastFetchTime: 0,
}))
// 计算属性
const talks = computed(() => talksState.value.talks)
const loading = computed(() => talksState.value.loading)
const error = computed(() => talksState.value.error)
// 合并加载状态（控制过渡动画）
const combinedLoading = computed(() => talksState.value.loading || userState.value.loading)
const progress = ref(0) // 加载进度条
const combinedError = computed(() => userState.value.error || talksState.value.error)
function formatTime(time: string) {
	const d = new Date(time)
	const ls = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()]
	const r = ls.map(a => (a.toString().length === 1 ? `0${a}` : a))
	return `${r[0]}-${r[1]}-${r[2]} ${r[3]}:${r[4]}`
}

function formatContent(item: any) {
	let content = item.content
	const imgs = item.imgs ? item.imgs.split(',') : []
	const ext = JSON.parse(item.ext || '{}')

	content = content
		.replace(/\[(.*?)\]\((.*?)\)/g, `<a class="talk_content_link" target="_blank" rel="nofollow" href="$2">@$1</a>`)
		.replace(/- \[ \]/g, '⚪')
		.replace(/- \[x\]/g, '⚫')
		.replace(/\n/g, '<br>')

	content = `<div class="talk_content_text">${content}</div>`

	return {
		text: content,
		images: imgs.map((img: string) => img.startsWith('http') ? img : `https:${img}`),
		music: ext.music?.type === 'tencent'
			? {
					type: ext.music.type,
					server: ext.music.server,
					id: ext.music.id,
					api: ext.music.api,
				}
			: null,
		video: ext.video?.type === 'bilibili'
			? {
					type: 'bilibili',
					url: ext.video.value,
					id: ext.video.value.match(/BV\w+/)?.[0],
				}
			: ext.video?.type === 'youtube'
				? {
						type: 'youtube',
						url: ext.video.value,
						id: ext.video.value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1],
					}
				: ext.video?.type === 'online'
					? {
							type: 'online',
							url: ext.video.value,
						}
					: null,
		doubanMovie: ext.doubanMovie?.id
			? {
					url: ext.doubanMovie.url,
					title: ext.doubanMovie.title,
					image: ext.doubanMovie.image,
					director: ext.doubanMovie.director,
					rating: ext.doubanMovie.rating,
					runtime: ext.doubanMovie.runtime,
				}
			: null,
		doubanBook: ext.doubanBook?.id
			? {
					url: ext.doubanBook.url,
					title: ext.doubanBook.title,
					image: ext.doubanBook.image,
					author: ext.doubanBook.author,
					pubDate: ext.doubanBook.pubDate,
					rating: ext.doubanBook.rating,
				}
			: null,
		externalLink: item.externalUrl
			? {
					url: item.externalUrl,
					title: item.externalTitle,
					favicon: item.externalFavicon,
				}
			: null,
	}
}

// 获取动态列表（原有逻辑）
async function fetchTalks() {
	// 如果距离上次获取时间小于30分钟，则使用缓存
	const now = Date.now()
	if (now - talksState.value.lastFetchTime < 30 * 60 * 1000) {
		return
	}
	try {
		talksState.value.loading = true
		talksState.value.error = false
		const data = await $fetch<{ code: number; data?: { list?: any[] } }>(API_CONFIG.MEMO_API, {
			method: 'POST',
			body: { size: API_CONFIG.PAGE_SIZE },
		})
		if (data.code === 0 && data.data?.list) {
			const formattedTalks = data.data.list.map((item: any) => ({
				content: formatContent(item),
				user: {
					username: item.user.username,
					nickname: item.user.nickname,
					avatarUrl: item.user.avatarUrl,
				},
				date: formatTime(item.createdAt),
				location: item.location || '',
				tags: item.tags
					? (typeof item.tags === 'string'
							? item.tags.split(',').filter((tag: string) => tag.trim())
							: item.tags)
					: ['无标签'],
			}))
			talksState.value.talks = formattedTalks
			talksState.value.lastFetchTime = Date.now()
		}
	}
	catch (err) {
		console.error('Error fetching talks:', err)
		talksState.value.error = true
	}
	finally {
		talksState.value.loading = false
		if (!talksState.value.error)
			progress.value = 100 // 动态列表加载完成，进度 100%
	}
}

async function goComment(content: string) {
	const textContent = content.replace(/<[^>]+>/g, '').trim()
	const twikooEl = document.querySelector('#twikoo') as HTMLElement
	if (!twikooEl) return

	// 1. 滚动到评论区
	twikooEl.scrollIntoView({ behavior: 'smooth', block: 'center' })

	// 2. 如果有"展开评论"按钮，先点它
	const expandBtn = twikooEl.querySelector('.tk-expand') as HTMLElement
	if (expandBtn) expandBtn.click()

	// 3. 等待输入框真正出现（最多 6 秒）
	let textarea: HTMLTextAreaElement | null = null
	for (let i = 0; i < 30; i++) {
		// 兼容多种可能的选择器
		textarea =
			twikooEl.querySelector('textarea[placeholder*="评论"]') ||
			twikooEl.querySelector('.tk-textarea') as HTMLTextAreaElement
		if (textarea) break
		await new Promise(res => setTimeout(res, 200))
	}

	if (!textarea) {
		console.warn('Twikoo 输入框仍未找到，可能未初始化或配置异常')
		return
	}

	// 4. 填充引用内容
	const quoted = textContent.split('\n').map(line => `> ${line}`).join('\n')
	textarea.focus()
	textarea.value = `${quoted}\n\n`
	textarea.dispatchEvent(new Event('input', { bubbles: true }))
}

// 跳转谷歌地图
function searchLocation(location: string) {
	if (!location) {
		return
	}
	// 使用谷歌地图搜索服务
	const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`
	window.open(searchUrl, '_blank')
}

const yearlyTip = computed(() => talks)

const showComment = ref(false)

function showCommentSection() {
	showComment.value = true
}
</script>

<template>
<!-- <PageBanner
        title="瞬间"
        subtitle="记录生活点滴，一些想法"
        image="https://lib.bsgun.cn/Hexo-static/img/essay-bg.avif"
    >
        <template #extra>
            <div class="essay-stats">
                <div class="powered-by">Powered by moments</div>
                <a class="essay-more" href="https://moment.051531.xyz" target="_blank" rel="noopener noreferrer">
                    <Icon name="icon-park-twotone:more-app" class="icon" />
                    查看更多
                </a>
            </div>
        </template>
    </PageBanner> -->

<div class="page-essay">
	<div class="talk-container">
		<Transition name="fade" mode="out-in">
			<!-- 加载中状态 -->
			<div v-if="combinedLoading" class="steam-loading-container">
				<div class="steam-loading-header">
					加载数据中...
				</div>
				<div class="steam-progress-bar">
					<div class="steam-progress" :style="{ width: `${Math.min((userState.loading ? 0.5 : 0) + (talksState.loading ? 0.5 : 0), 1) * 100}%` }" />
				</div>
				<p class="steam-loading-subtext">
					正在获取 Moments 数据...
				</p>
			</div>
			<div v-else-if="combinedError" class="error-container">
				<Icon name="line-md:alert" class="error-icon" />
				<p>加载失败，请刷新页面重试</p>
			</div>
			<div v-else class="talk-main">
				<!-- 用户资料区域 -->
				<div class="profile">
					<div class="header">
						<img
							class="avatar"
							:src="userState.data?.avatarUrl"
							:alt="userState.data?.nickname"
						>
						<div class="info">
							<div class="row">
								<h2 class="username">
									{{ userState.data?.nickname || userState.data?.username || '加载中...' }}
									<Icon v-if="user" name="material-symbols:verified" class="verified" />
								</h2>
							</div>
							<div v-if="user" class="row">
								<span class="bio">{{ userState.data?.slogan || '这个人很懒，什么都没留下' }}</span>
							</div>
							<span v-for="item in talksState.talks.slice(-999, 1)" class="bio">更新时间：{{ dayjs(item.date).locale('zh-cn').fromNow().replaceAll(/\s+/g, '') }}</span>
						</div>
					</div>
				</div>
				<!-- 统计卡片区域 -->
				<div class="overview">
					<div class="stat-card">
						<Icon name="material-symbols:post-add" class="stat-icon" />
						<div class="stat-info">
							<div class="stat-label">
								总发布
							</div>
							<div class="stat-value">
								{{ talks.length }}
							</div>
						</div>
					</div>
					<div class="stat-card">
						<Icon name="material-symbols:image" class="stat-icon" />
						<div class="stat-info">
							<div class="stat-label">
								总标签
							</div>
							<div v-for="item in talksState.talks.slice(-999, 1)" class="stat-value">
								{{ item.tags.length }}
							</div>
						</div>
					</div>
					<!-- <div class="stat-card">
                            <Icon name="material-symbols:music-note" class="stat-icon" />
                            <div class="stat-info">
                                <div class="stat-label"></div>
                                <div class="stat-value">{{ talks.filter(t => t.content.music).length }}</div>
                            </div>
                        </div> -->
				</div>
				<div class="talks-list">
					<div
						v-for="(item, index) in talks"
						:key="index"
						class="talk-item"
						:style="{ '--delay': `${index * 0.1}s` }"
					>
						<div class="talk-meta">
							<img
								class="avatar"
								:src="item.user.avatarUrl"
								:alt="item.user.nickname"
							>
							<div class="info">
								<div class="talk-nick">
									{{ item.user.nickname }}
									<Icon name="material-symbols:verified verified" class="verified" />
								</div>
								<div class="talk-date">
									{{ dayjs(item.date).locale('zh-cn').fromNow().replaceAll(/\s+/g, '') }}
								</div>
							</div>
						</div>
						<div class="talk-content">
							<div class="talk_content_text" v-html="item.content.text" />

						<div v-if="item.content.music">
							<meting-js
								v-if="item.content.music.type === 'tencent'"
								:id="item.content.music.id"
								:server="item.content.music.server"
								:api="item.content.music.api"
							/>
						</div>

							<div v-if="item.content.images.length" class="zone_imgbox">
								<figure
									v-for="(img, imgIndex) in item.content.images"
									:key="imgIndex"
									class="img-item"
								>
									<Pic
										:src="img"
										zoom
										class="talk-img"
										loading="lazy"
										:fetchpriority="imgIndex === 0 ? 'high' : 'low'"
									/>
								</figure>
							</div>

							<div v-if="item.content.video" class="video-container">
								<iframe
									v-if="item.content.video.type === 'bilibili'"
									:src="`//player.bilibili.com/player.html?bvid=${item.content.video.id}&autoplay=0`"
									scrolling="no"
									frameborder="no"
									allowfullscreen="true"
								/>
								<iframe
									v-else-if="item.content.video.type === 'youtube'"
									:src="`https://www.youtube.com/embed/${item.content.video.id}`"
									frameborder="0"
									allowfullscreen
								/>
								<video
									v-else-if="item.content.video.type === 'online'"
									:src="item.content.video.url"
									controls
									class="online-video"
								/>
							</div>

							<a
								v-if="item.content.doubanMovie"
								class="douban-card gradient-card"
								:href="item.content.doubanMovie.url"
								target="_blank"
							>
								<div
									class="douban-card-bgimg"
									:style="{ backgroundImage: `url('${item.content.doubanMovie.image}')` }"
								/>
								<div class="douban-card-left">
									<div
										class="douban-card-img"
										:style="{ backgroundImage: `url('${item.content.doubanMovie.image}')` }"
									/>
								</div>
								<div class="douban-card-right">
									<div class="douban-card-item">
										<span>电影名: </span>
										<strong>{{ item.content.doubanMovie.title }}</strong>
									</div>
									<div class="douban-card-item">
										<span>导演: </span>
										{{ item.content.doubanMovie.director }}
									</div>
									<div class="douban-card-item">
										<span>评分: </span>
										{{ item.content.doubanMovie.rating }}
									</div>
									<div class="douban-card-item">
										<span>时长: </span>
										{{ item.content.doubanMovie.runtime }}
									</div>
								</div>
							</a>

							<a
								v-if="item.content.doubanBook"
								class="douban-card gradient-card"
								:href="item.content.doubanBook.url"
								target="_blank"
							>
								<div
									class="douban-card-bgimg"
									:style="{ backgroundImage: `url('${item.content.doubanBook.image}')` }"
								/>
								<div class="douban-card-left">
									<div
										class="douban-card-img"
										:style="{ backgroundImage: `url('${item.content.doubanBook.image}')` }"
									/>
								</div>
								<div class="douban-card-right">
									<div class="douban-card-item">
										<span>书名: </span>
										<strong>{{ item.content.doubanBook.title }}</strong>
									</div>
									<div class="douban-card-item">
										<span>作者: </span>
										{{ item.content.doubanBook.author }}
									</div>
									<div class="douban-card-item">
										<span>出版年份: </span>
										{{ item.content.doubanBook.pubDate }}
									</div>
									<div class="douban-card-item">
										<span>评分: </span>
										{{ item.content.doubanBook.rating }}
									</div>
								</div>
							</a>

							<div v-if="item.content.externalLink" class="external-link gradient-card">
								<a :href="item.content.externalLink.url" target="_blank" rel="nofollow">
									<div class="link-left">
										<img :src="item.content.externalLink.favicon" :alt="item.content.externalLink.title">
									</div>
									<div class="link-right">
										<div class="link-title">
											{{ item.content.externalLink.title }}
										</div>
										<Icon name="material-symbols:chevron-right" class="icon" />
									</div>
								</a>
							</div>
						</div>
						<div class="talk-bottom">
							<div class="talk-tags">
								<span class="tag">
									🏷️{{ Array.isArray(item.tags) ? item.tags.join(', ') : item.tags }}
								</span>
								<span
									v-if="item.location"
									v-tip="`搜索: ${item.location}`"
									class="location"
									@click="searchLocation(item.location)"
								>
									<Icon name="ph:map-pin-bold" class="location-icon" />
									{{ item.location }}
								</span>
							</div>
							<button v-tip="`评论`" class="comment-btn" @click="goComment(item.content.text) ">
								<Icon name="ph:chats-bold" class="icon" />
							</button>
						</div>
					</div>
					<!-- 底部提示 -->
					<div class="talks-footer">
						<p>仅显示最近 30 条记录</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</div>
<PostComment key="/moments" />
</template>

<style lang="scss" scoped>
// stats 区域
.essay-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: .1rem;
    color: #eee;
    text-shadow: 0 4px 5px rgba(0, 0, 0, 0.5);
    font-family: var(--font-monospace);
    opacity: 0.7;

    .powered-by {
        font-size: .7rem;
    }

    .essay-more {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: .8rem;
        opacity: .8;
        transition: all 0.2s;

        &:hover {
            color: #fff;
            opacity: 1;
        }
    }
}
.page-essay {
    margin: 1rem;
    animation: float-in 0.2s backwards;
    .talk-container {
        .talk-main {
            display: flex;
            flex-direction: column;
        }
        /* Steam 风格加载页 */
        .steam-loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            color: #333;
            gap: 16px;

            .steam-loading-header {
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--c-text);
            }

            .steam-progress-bar {
                width: 80%;
                height: 5px;
                background-color: var(--c-text);
                border-radius: 5px;
                overflow: hidden;

                .steam-progress {
                    height: 100%;
                    background-color:  var(--c-primary);
                    transition: width 0.3s ease;
                }
            }

            .steam-loading-subtext {
                font-size: 0.9rem;
                color: #666;
            }
        }
    }

    .profile {
        background: var(--ld-bg-card);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 0 0 1px var(--c-bg-soft);
        margin-bottom: 1rem;
        display: flex;
        gap: 0.5rem;
        animation: float-in 0.3s backwards;
        transition: border-color 0.3s;

        .header {
            align-items: flex-start;
            display: flex;
            gap: 1em;
            .avatar {
                flex-shrink: 0;
                height: 100px;
                object-fit: cover;
                width: 100px;
                border: 2px solid var(--c-primary);
                border-radius: 50%;
                img:before {
                    background-color: var(--c-border);
                    color: var(--c-bg-soft);
                    content: attr(alt);
                    display: grid;
                    font: 700 1.5rem / 1.2 var(--font-serif);
                    inset: 0;
                    overflow: visible;
                    padding: .5em;
                    place-content: center;
                    position: absolute;
                    text-align: center;
                    text-shadow: none;
                    word-break: normal;
                }
            }
            .info {
                min-width: 0px;
                flex: 1 1 0%;

                .row {
                    align-items: center;
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: 0.5em;
                    gap: 0.75em;

                    .username {
                        color: var(--c-text);
                        font-size: 1.25em;
                        font-weight: 600;
                        word-break: break-word;
                        margin: 0px;
                    }
                }
            }
        }
    }
    // 统计卡片区域
    .overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;

        .stat-card {
            background: var(--ld-bg-card);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 0 0 1px var(--c-bg-soft);
            margin-bottom: 1rem;
            display: flex;
            gap: 0.5rem;
            animation: float-in 0.3s backwards;
            transition: border-color 0.3s;
            align-items: center;

            .stat-icon {
                font-size: 1.8rem;
                color: var(--c-primary);
            }

            .stat-info {
                .stat-label {
                    font-size: 0.9rem;
                    color: var(--c-text-2);
                }

                .stat-value {
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: var(--c-text);
                }
            }
        }
    }
    .talk-item {
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 0 0 1px var(--c-bg-soft);
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        animation: float-in 0.3s backwards;
        animation-delay: var(--delay);
    }

    .talk-meta {
        display: flex;
        align-items: center;
        gap: 10px;

        .avatar {
            width: 3em;
            border-radius: 2em;
            box-shadow: 2px 4px 1rem var(--ld-shadow);
        }

        .info {
            .talk-nick {
                display: flex;
                align-items: center;
                gap: 5px;

                .verified {
                    color: var(--c-primary);
                    font-size: 16px;
                }
            }

            .talk-date {
                font-size: 0.8rem;
                color: var(--c-text-3);
                font-family: var(--font-monospace);
            }
        }
    }

    .talk-content {
        line-height: 1.6;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        color: var(--c-text-2);

        :deep(.talk_content_link) {
            margin: 0 -0.1em;
            padding: 0 0.1em;
            background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
            color: var(--c-primary);
            text-decoration: none;
            transition: all 0.2s;

            &:hover {
                border-radius: 0.3em;
                background-size: 100% 100%;
            }
        }

        :deep(.zone_imgbox) {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;

            .img-item {
                position: relative;
                padding-bottom: 100%;
                border-radius: 8px;
                overflow: hidden;

                img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: zoom-in;
                    transition: transform .3s;

                    &:hover {
                        transform: scale(1.05);
                    }
                }
            }
        }

        .video-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            border-radius: 8px;
            overflow: hidden;

            iframe,
            video {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
            }

            .online-video {
                object-fit: cover;
            }
        }

        .douban-card {
            display: flex;
            overflow: hidden;
            text-decoration: none;
            background-color: var(--c-bg-2);
            box-shadow: 0 0 0 1px var(--c-bg-soft);
            position: relative;
            height: 100px;

            .douban-card-bgimg {
                position: absolute;
                inset: 0;
                filter: blur(15px);
                opacity: 0.3;
                background-size: cover;
                background-position: center;
            }

            .douban-card-left {
                flex: 0 0 80px;
                padding: 10px;
                position: relative;

                .douban-card-img {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    border-radius: 8px;
                }
            }

            .douban-card-right {
                flex: 1;
                padding: 10px;
                position: relative;

                .douban-card-item {
                    color: var(--c-text);
                    font-size: 0.8rem;
                }
            }
        }

        .external-link {
            overflow: hidden;
            background-color: var(--c-bg-2);
            box-shadow: 0 0 0 1px var(--c-bg-soft);
            transition: all .2s;

            a {
                display: flex;
                text-decoration: none;
                height: 60px;
                align-items: center;
                gap: 12px;
                padding: 8px;

                .link-left {
                    width: 44px;
                    height: 44px;
                    overflow: hidden;
                    flex-shrink: 0;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        border-radius: 8px;
                        transition: transform .3s;
                    }
                }

                .link-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 6px;

                    .link-title {
                        color: var(--c-text-2);
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        font-size: 0.95rem;
                        transition: all .2s;
                    }

                    .icon {
                        color: var(--c-text-3);
                        transition: transform 0.2s ease;
                    }
                }

                &:hover {
                    .link-left img {
                        transform: scale(1.05);
                    }

                    .icon {
                        transform: translateX(4px) scale(1.6);
                    }
                }
            }
        }
    }

    .talk-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--c-text-3);

        .talk-tags {
            display: flex;
            gap: 4px;
            font-size: .7rem;

            .tag,
            .location {
                background-color: var(--c-bg-2);
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                padding: 2px 4px;
                transition: all .2s;

                &:hover {
                    opacity: 0.8;
                }
            }

            .location {
                color: var(--c-primary);
            }
        }
    }

    .loading-container,
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 500px;
        color: var(--c-text-2);
        gap: 12px;

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--c-bg-3);
            border-top: 3px solid var(--c-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .error-icon {
            font-size: 4rem;
            color: var(--c-danger);
        }
    }

    .talks-footer {
        text-align: center;
        padding: 2rem 0;
        color: var(--c-text-3);
        font-size: 0.9rem;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
