<script setup lang="ts">
import type { WidgetName } from '~/composables/useWidgets'
import { computed, watch } from 'vue'
import { myFeed } from '~~/blog.config'
import FriendLinkCard from '~/components/partial/FriendLinkCard.vue'
import feeds from '~/feeds'
import FlinkTopCard from '~/components/card/FlinkTopCard.vue'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

// 根据配置决定是否显示侧边栏图片
const asideWidgets = computed<WidgetName[]>(() => {
	const widgets: WidgetName[] = ['blog-stats', 'latest-comments', 'comm-group', 'poetry']

	// 如果启用了侧边栏图片，在公告后添加图片组件
	if (appConfig.sidebarImage?.enabled) {
		// 在 'announcement-card' 后插入 'sidebar-image'
		const announcementIndex = widgets.indexOf('announcement-card')
		if (announcementIndex !== -1) {
			widgets.splice(announcementIndex + 1, 0, 'sidebar-image')
		}
	}

	return widgets
})

watch(asideWidgets, (newWidgets) => {
	layoutStore.setAside(newWidgets)
}, { immediate: true })

const { data: postLink } = await useAsyncData('/link', () => queryCollection('content').path('/link').first())

// 设置CSS变量
const primaryColor = appConfig.theme?.primary || 'var(--c-primary)'
useSeoMeta({
	title: '友链',
	ogType: 'profile',
	description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})

const copyFields = {
	博主: myFeed.author,
	标题: myFeed.title,
	介绍: myFeed.desc,
	网址: myFeed.link,
	头像: myFeed.avatar,
}

// 分类友链
const categorizedFeeds = computed(() => {
	return feeds.reduce((acc: Record<string, any[]>, category) => {
		acc[category.name] = category.entries || []
		return acc
	}, {} as Record<string, any[]>)
})

const activeCategory = ref(feeds[0]?.name || '')
const isTransitioning = ref(false)

function handleCategoryChange(category: string) {
	if (isTransitioning.value)
		return
	isTransitioning.value = true
	activeCategory.value = category
	setTimeout(() => {
		isTransitioning.value = false
	}, 300)
}

// 复制到剪贴板功能
async function copyToClipboard(text: string, prompt: string) {
	try {
		await navigator.clipboard.writeText(text)
		// 显示复制成功提示
		showToast(`已复制${prompt}`)
	}
	catch (err) {
		console.error('复制失败:', err)
		showToast('复制失败，请重试')
	}
}

// 显示提示消息
function showToast(message: string) {
	// 创建一个简单的提示元素
	const toast = document.createElement('div')
	toast.textContent = message
	toast.style.position = 'fixed'
	toast.style.top = '20px'
	toast.style.left = '50%'
	toast.style.transform = 'translateX(-50%)'
	toast.style.backgroundColor = 'var(--c-primary)'
	toast.style.color = 'white'
	toast.style.padding = '0.8rem 1.5rem'
	toast.style.borderRadius = '8px'
	toast.style.zIndex = '1000'
	toast.style.fontSize = '0.9rem'
	toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'

	document.body.appendChild(toast)

	// 3秒后自动移除
	setTimeout(() => {
		document.body.removeChild(toast)
	}, 3000)
}
</script>

<template>
<div class="page-links">
	<!-- 我的博客信息 -->
	<div class="my-blog-section" style="margin-top: 2rem;">
		<div
			class="my-blog-card" style="
      background: var(--ld-bg-card);
      border: 1px solid var(--c-border);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px var(--ld-shadow);
      transition: all 0.3s ease;
      max-width: 800px;
      margin: 0 auto;
    "
		>
			<!-- 头像和基本信息 -->
			<div class="blog-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
				<div class="avatar-wrapper" style="position: relative; flex-shrink: 0;">
					<img
						:src="myFeed.avatar" :alt="myFeed.author" class="blog-avatar" style="
            width: 64px;
            height: 64px;
            border-radius: 12px;
            object-fit: cover;
            border: 1.5px solid var(--c-border);
          "
					>
					<span
						class="blog-owner-badge" :style="{
							position: 'absolute',
							top: '-4px',
							right: '-4px',
							background: 'var(--c-primary)',
							color: 'white',
							padding: '3px 8px',
							borderRadius: '8px',
							fontSize: '0.65rem',
							fontWeight: '600',
							zIndex: '5',
						}"
					>博主</span>
				</div>
				<div class="blog-main-info">
					<h3 class="blog-name" style="font-size: 1.4rem; font-weight: 600; margin: 0 0 0.5rem 0; color: var(--c-text);">
						{{ myFeed.author }}
					</h3>
					<p class="blog-subtitle" style="font-size: 1rem; color: var(--c-text-2); margin: 0; font-weight: 500;">
						{{ myFeed.title }}
					</p>
				</div>
			</div>

			<!-- 博客描述 -->
			<div class="blog-content" style="margin-bottom: 1.5rem;">
				<p
					class="blog-desc" style="
          font-size: 1rem;
          line-height: 1.5;
          color: var(--c-text);
          margin: 0;
          padding: 0.8rem;
          background: rgba(74, 144, 226, 0.06);
          border-radius: 10px;
          border-left: 3px solid var(--c-primary);
        "
				>
					{{ myFeed.desc }}
				</p>
			</div>

			<!-- 复制按钮 -->
			<div class="blog-actions">
				<div class="copy-buttons" style="display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: flex-start; margin-top: 1.5rem;">
					<Copy v-for="(code, prompt) in copyFields" :key="prompt" :prompt :code />
				</div>
			</div>
		</div>
	</div>

   <FlinkTopCard />

	<!-- 友链分类标签 -->
	<div class="categories-section" style="margin-top: 2rem;">
		<h2>友链分类</h2>
		<div class="category-tabs">
			<button
				v-for="category in Object.keys(categorizedFeeds)"
				:key="category"
				class="category-tab" :class="[{ active: activeCategory === category }]"
				@click="handleCategoryChange(category)"
			>
				{{ category }}
			</button>
		</div>
	</div>

	<!-- 友链网格 -->
	<div class="feeds-section">
		<div class="feeds-grid">
			<FriendLinkCard
				v-for="feed in categorizedFeeds[activeCategory]"
				:key="feed.link"
				:site-name="feed.author"
				:sitenick="feed.sitenick"
				:site-url="feed.link"
				:site-desc="feed.desc"
				:site-icon="feed.avatar || feed.icon"
				:date="feed.date"
				:upstream="feed.upstream || false"
				:qrcode="feed.qrcode || ''"
				:recommend="feed.recommend || false"
			/>
		</div>
	</div>

	<!-- 申请友链 -->
	<div
		class="apply-section" style="
    background: var(--ld-bg-card);
    border: 1px solid var(--c-border);
    border-radius: 14px;
    padding: 2rem;
    margin-top: 2.5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  "
	>
		<h2
			style="
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--c-primary);
      margin: 0 0 1.2rem 0;
      text-align: center;
    "
		>
			申请友链
		</h2>

		<div class="apply-content" style="font-size: 0.95rem; line-height: 1.6; color: var(--c-text);">
			<!-- 申请要求 -->
			<div style="margin-bottom: 1.5rem;">
				<h3 style="font-size: 1.1rem; font-weight: 600; color: var(--c-primary); margin: 0 0 0.8rem 0; display: flex; align-items: center; gap: 0.6rem;">
					<span
						style="
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--c-primary);
            border-radius: 50%;
          "
					/>
					申请要求
				</h3>
				<ul style="list-style: none; padding: 0; margin: 0;">
					<li style="display: flex; align-items: flex-start; margin-bottom: 0.6rem;">
						<span
							style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              background: rgba(var(--c-primary-rgb), 0.2);
              color: var(--c-primary);
              border-radius: 50%;
              font-weight: 600;
              margin-right: 0.6rem;
              flex-shrink: 0;
            "
						>✓</span>
						<span>能够<strong>长期更新维护</strong>，并输出<strong>有价值的原创内容</strong></span>
					</li>
					<li style="display: flex; align-items: flex-start; margin-bottom: 0.6rem;">
						<span
							style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              background: color-mix(in srgb, var(--c-primary) 20%, transparent);
              color: var(--c-primary);
              border-radius: 50%;
              font-weight: 600;
              margin-right: 0.6rem;
              flex-shrink: 0;
            "
						>✓</span>
						<span>可以参考 <a href="https://www.travellings.cn/docs/join.html" target="_blank" style="color: var(--c-primary); text-decoration: none; font-weight: 500;">加入开往</a> 页面的规则</span>
					</li>
				</ul>
			</div>

			<!-- 申请方式 -->
			<div style="margin-bottom: 2rem;">
				<h3 style="font-size: 1.1rem; font-weight: 600; color: var(--c-primary); margin: 0 0 0.8rem 0; display: flex; align-items: center; gap: 0.6rem;">
					<span
						style="
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--c-primary);
            border-radius: 50%;
          "
					/>
					申请方式
				</h3>
				<div
					style="
          background: rgba(74, 144, 226, 0.08);
          padding: 1.5rem;
          border-radius: 12px;
        "
				>
					<p style="margin: 0 0 1rem 0; color: var(--c-text);">
						在评论区留言或发送邮件到：
					</p>
					<div
						style="
            background: var(--ld-bg-card);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--c-border);
            font-family: 'Fira Code', monospace;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          "
					>
						<span style="color: var(--c-primary); font-weight: 600;">me@mcyzsx.top</span>
						<button
							style="
              background: color-mix(in srgb, var(--c-primary) 20%, transparent);
              border: 1px solid color-mix(in srgb, var(--c-primary) 30%, transparent);
              color: var(--c-primary);
              padding: 0.3rem 0.8rem;
              border-radius: 6px;
              font-size: 0.8rem;
              margin-left: 0.8rem;
              cursor: pointer;
              transition: all 0.2s ease;
            " @click="copyToClipboard('me@mcyzsx.top', '邮箱')"
						>
							复制
						</button>
					</div>

					<p style="margin: 0 0 0.5rem 0; font-weight: 500;">
						邮件标题注明：
					</p>
					<code
						style="
            background: color-mix(in srgb, var(--c-primary) 15%, transparent);
            color: var(--c-primary);
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-size: 0.9rem;
            font-family: 'Fira Code', monospace;
            font-weight: 600;
          "
					>友链申请: 你的昵称</code>

					<p style="margin: 1rem 0 0.5rem 0; font-weight: 500;">
						附上友链信息：
					</p>
					<div
						style="
            background: color-mix(in srgb, var(--c-primary) 8%, transparent);
            border: 2px dashed color-mix(in srgb, var(--c-primary) 30%, transparent);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1rem 0;
            text-align: center;
          "
					>
						<div
							style="
              font-family: 'Fira Code', monospace;
              font-size: 1rem;
              color: var(--c-primary);
              font-weight: 600;
              margin-bottom: 0.5rem;
            "
						>
							博客名称、描述、地址、头像等信息
						</div>
						<div style="font-size: 0.9rem; color: var(--c-text-2);">
							任意格式均可，包含基本信息即可
						</div>
					</div>
				</div>
			</div>

			<!-- 注意事项 -->
			<div>
				<h3 style="font-size: 1.1rem; font-weight: 600; color: var(--c-primary); margin: 0 0 0.8rem 0; display: flex; align-items: center; gap: 0.6rem;">
					<span
						style="
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--c-primary);
            border-radius: 50%;
          "
					/>
					注意事项
				</h3>
				<div
					style="
          background: rgba(74, 144, 226, 0.08);
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--c-text);
        "
				>
					<strong>注意：</strong>信息可能会被适当修改，以保证展示效果
				</div>
			</div>
		</div>
	</div>

	<PostComment />
</div>
</template>

<style lang="scss" scoped>
.page-links {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;

  .page-header {
    text-align: center;
    margin: 2rem 0 3rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      font-size: 1.1rem;
      color: var(--c-text-2);
      margin: 0.5rem 0 0;
    }
  }

  // 电影票样式卡片
  .ticket-card {
    background: var(--ld-bg-card);
    border-radius: 12px;
    padding: 0;
    position: relative;
    border: 1px solid var(--c-border);
    box-shadow: 0 4px 20px var(--ld-shadow);

    .ticket-notch {
      position: absolute;
      left: 20px;
      right: 20px;
      height: 8px;
      background: var(--c-bg);
      border-radius: 0 0 4px 4px;

      &:first-child {
        top: -4px;
      }

      &:last-child {
        bottom: -4px;
        border-radius: 4px 4px 0 0;
      }
    }

    .card-content {
      padding: 1.5rem;
    }
  }

  .info-section {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--c-text);
    }

    .info-card {
      .avatar-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          object-fit: cover;
        }

        .avatar-info {
          h3 {
            margin: 0;
            font-size: 1.2rem;
            color: var(--c-text);
          }

          p {
            margin: 0.25rem 0 0;
            color: var(--c-text-2);
            font-size: 0.9rem;
          }
        }
      }

      .description {
        color: var(--c-text-2);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .copy-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }
  }

  .categories-section {
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--c-text);
    }

    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .category-tab {
        padding: 0.5rem 1.5rem;
        border-radius: 25px;
        background: var(--c-bg-soft);
        border: 1px solid var(--c-border);
        color: var(--c-text-2);
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
          background: var(--c-primary-soft);
          color: var(--c-primary);
        }

        &.active {
          background: var(--c-primary);
          color: white;
          border-color: var(--c-primary);
        }
      }
    }
  }

  .feeds-section {
    margin-bottom: 3rem;

    .feeds-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      justify-content: center;
    }
  }

  .apply-section {
    background: var(--ld-bg-card);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 4px 20px var(--ld-shadow);
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--c-text);
    }

    .apply-content {
      .article {
        line-height: 1.6;

        :deep(*) {
          margin: 1rem 0;
        }

        :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
          color: var(--c-text);
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        :deep(a) {
          color: var(--c-primary);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .page-links {
    padding: 0 0.5rem;

    .page-header {
      h1 {
        font-size: 2rem;
      }
    }

    .feeds-grid {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }

    .category-tabs {
      justify-content: center;

      .category-tab {
        padding: 0.4rem 1rem !important;
        font-size: 0.9rem;
      }
    }

    .apply-section {
      padding: 1rem !important;
    }
  }

  /* 我的博客信息卡片标题样式 */
  .my-blog-section {
    margin-bottom: 2rem;

    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--c-text);
      text-align: center;
      background: linear-gradient(135deg, #7c3aed, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  /* 友链分类间距调整 */
  .categories-section {
    margin-top: 15rem;
  }
}
</style>
