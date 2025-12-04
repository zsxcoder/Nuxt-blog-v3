<template>
  <div class="moments-page">
    <div class="container">
      <PageBanner title="说说" description="记录生活点滴，一些想法。" image="/image/MomentBanner.webp" />

      <!-- 标签下拉 -->
      <div ref="tagDropdownRef" class="category-dropdown">
        <div
          class="dropdown-trigger"
          :class="{ active: isTagDropdownOpen }"
          @click="toggleTagDropdown"
        >
          <div class="selected-content">
            <Icon name="ph:tag-bold" class="selected-icon" />
            <span class="selected-category">标签: {{ currentTagLabel }}</span>
          </div>
          <Icon name="ph:caret-down" class="dropdown-icon" :class="{ rotated: isTagDropdownOpen }" />
        </div>

        <Transition name="dropdown">
          <div v-if="isTagDropdownOpen" class="dropdown-menu" @click.stop>
            <div
              class="dropdown-item"
              :class="{ active: !activeTag, selected: !activeTag }"
              @click="selectTag(undefined)"
            >
              <div class="category-content">
                <Icon name="ph:tag-bold" class="category-icon" />
                <span class="category-text">全部</span>
              </div>
              <Icon v-if="!activeTag" name="ph:check" class="check-icon" />
            </div>
            <div
              v-for="t in allTags"
              :key="t"
              class="dropdown-item"
              :class="{ active: activeTag === t, selected: activeTag === t }"
              @click="selectTag(t)"
            >
              <div class="category-content">
                <Icon name="ph:tag-bold" class="category-icon" />
                <span class="category-text">{{ t }}</span>
              </div>
              <Icon v-if="activeTag === t" name="ph:check" class="check-icon" />
            </div>
          </div>
        </Transition>
      </div>

      <!-- 日记列表 -->
      <div class="moments-grid">
        <article
          v-for="moment in displayedMoments"
          :key="moment.id"
          class="moment-card"
        >
          <div class="moment-header">
            <NuxtImg
              :src="moment.author.avatar"
              :alt="moment.author.name"
              width="44"
              height="44"
              class="author-avatar"
            />
            <div class="author-info">
              <div class="author-main">
                <h3 class="author-name">{{ moment.author.name }}</h3>
                <div v-if="moment.author.badges?.length" class="badges-container">
                  <span v-for="b in moment.author.badges" :key="b" class="badge">{{ b }}</span>
                </div>
              </div>
              <div class="meta-info">
                <time class="moment-time">{{ formatTime(moment.createdAt) }}</time>
                <span v-if="moment.location" class="location-separator">·</span>
                <span v-if="moment.location" class="location">{{ moment.location }}</span>
              </div>
            </div>
          </div>

          <div class="moment-content">
            <MarkdownRender :markdown="moment.content" />

            <div v-if="moment.url" class="url-cards">
              <LinkCard
                v-for="(u, idx) in normalizeUrls(moment.url)"
                :key="idx"
                :url="u"
                :title="moment.urlCard?.title"
                :description="moment.urlCard?.description"
                :icon="moment.urlCard?.icon"
              />
            </div>

            <div v-if="moment.images?.length" class="moment-images" :class="{ single_image: moment.images.length===1, grid_images: moment.images.length>1 }">
              <NuxtImg
                v-for="(img, idx) in moment.images"
                :key="idx"
                :src="img"
                :alt="`图片 ${idx+1}`"
                class="moment-image"
                :class="{ grid_item: moment.images.length>1 }"
                loading="lazy"
                @click="openPhotoPreview(img, moment.images, idx)"
              />
            </div>

            <VideoPlayer v-for="v in moment.videos" :key="v.id" v-bind="v" />
            <GithubRepo v-if="moment.github" :repo="moment.github" />
            <MusicPlayer v-if="moment.music" :list="moment.music" />

            <div v-if="moment.tags?.length" class="tags">
              <span v-for="t in moment.tags" :key="t">#{{ t }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages>1" class="pagination">
        <button :disabled="currentPage===1" class="pagination-btn" @click="currentPage--">上一页</button>
        <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button :disabled="currentPage===totalPages" class="pagination-btn" @click="currentPage++">下一页</button>
      </div>
    </div>

    <!-- 图片预览 -->
    <div v-if="showPreview" class="photo-preview-modal" @click="closePhotoPreview">
      <div class="preview-content" @click.stop>
        <button class="close-btn" @click="closePhotoPreview"><Icon name="ph:x-bold" /></button>
        <div class="preview-image-container">
          <button v-if="currentMomentImages.length>1" class="nav-btn prev-btn" @click="prevPhoto"><Icon name="ph:caret-left-bold" size="32" /></button>
          <NuxtImg :src="currentPhoto" class="preview-image" />
          <button v-if="currentMomentImages.length>1" class="nav-btn next-btn" @click="nextPhoto"><Icon name="ph:caret-right-bold" size="32" /></button>
        </div>
        <div v-if="currentMomentImages.length>1" class="photo-counter">{{ currentPhotoIndex+1 }} / {{ currentMomentImages.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MomentItem } from '~/types/moments'
import { onClickOutside } from '@vueuse/core'
import GithubRepo from '~/components/moment/GithubRepo.vue'
import LinkCard from '~/components/moment/LinkCard.vue'
import MarkdownRender from '~/components/moment/MarkdownRender.vue'
import MusicPlayer from '~/components/moment/MusicPlayer.vue'
import VideoPlayer from '~/components/moment/VideoPlayer.vue'
import PageBanner from '~/components/partial/PageBanner.vue'
import { useEchoMoments } from '~/composables/useEcho'

/* ------ 侧边栏 / SEO ------ */
const appConfig = useAppConfig()
const asideWidgets = computed<WidgetName[]>(() => {
  const widgets: WidgetName[] = ['blog-stats', 'announcement-card', 'theme-card']
  if (appConfig.sidebarImage?.enabled) {
    const idx = widgets.indexOf('announcement-card')
    if (idx !== -1) widgets.splice(idx + 1, 0, 'sidebar-image')
  }
  return widgets
})
const layoutStore = useLayoutStore()
layoutStore.setAside(asideWidgets.value)

const defaultAuthor = { name: '钟神秀', avatar: 'https://gravatar.mcyzsx.top/avatar/me', badges: ['站长'] }
const title = '说说'
const description = '记录生活点滴，一些想法。'
const image = '/image/MomentBanner.webp'
useSeoMeta({ title, description, ogImage: image })

/* ------ 数据（Echo）------ */
const sortedMoments = await useEchoMoments()

/* ------ 标签下拉 ------ */
const route = useRoute()
const currentPage = ref(1)
const pageSize = 5

const activeTag = computed<string>({
  get() {
    const t = route.query.tag
    return typeof t === 'string' ? t.trim() : ''
  },
  set(val) {
    navigateTo({ query: { ...route.query, tag: val || undefined } })
  },
})

const allTags = computed(() => {
  const set = new Set<string>()
  sortedMoments.forEach(m => m.tags?.forEach(set.add.bind(set)))
  return Array.from(set).sort()
})
const currentTagLabel = computed(() => activeTag.value || '全部')

const tagDropdownRef = ref<HTMLElement | null>(null)
const isTagDropdownOpen = ref(false)
function toggleTagDropdown() { isTagDropdownOpen.value = !isTagDropdownOpen.value }
function selectTag(t: string | undefined) { activeTag.value = t ?? ''; isTagDropdownOpen.value = false }
onClickOutside(tagDropdownRef, () => { isTagDropdownOpen.value = false })

/* ------ 筛选 + 分页 ------ */
const displayedMoments = computed(() => {
  const list = activeTag.value ? sortedMoments.filter(m => m.tags?.includes(activeTag.value)) : sortedMoments
  const start = (currentPage.value - 1) * pageSize
  return list.slice(start, start + pageSize)
})
const totalPages = computed(() => {
  const list = activeTag.value ? sortedMoments.filter(m => m.tags?.includes(activeTag.value)) : sortedMoments
  return Math.ceil(list.length / pageSize)
})

/* ------ 时间格式化 ------ */
function formatTime(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }).replace(/\//g, '-').replace(',', '')
}

/* ------ url 归一化 ------ */
function normalizeUrls(url?: string | string[]) {
  if (!url) return []
  return Array.isArray(url) ? url : [url]
}

/* ------ 图片预览 ------ */
const showPreview = ref(false)
const currentPhoto = ref('')
const currentPhotoIndex = ref(0)
const currentMomentImages = ref<string[]>([])

function openPhotoPreview(photo: string, images: string[], index: number) {
  currentPhoto.value = photo
  currentPhotoIndex.value = index
  currentMomentImages.value = images
  showPreview.value = true
}
function closePhotoPreview() { showPreview.value = false }
function nextPhoto() {
  if (currentMomentImages.value.length <= 1) return
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % currentMomentImages.value.length
  currentPhoto.value = currentMomentImages.value[currentPhotoIndex.value]
}
function prevPhoto() {
  if (currentMomentImages.value.length <= 1) return
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + currentMomentImages.value.length) % currentMomentImages.value.length
  currentPhoto.value = currentMomentImages.value[currentPhotoIndex.value]
}

/* ------ 键盘事件 ------ */
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (!showPreview.value) return
    if (e.key === 'Escape') closePhotoPreview()
    else if (e.key === 'ArrowRight') nextPhoto()
    else if (e.key === 'ArrowLeft') prevPhoto()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<style scoped lang="scss">
/* ===== 复刻 moments 原样式 ===== */
.moments-page { min-height: 100vh; padding: 2rem 0; }
.container { max-width: 700px; margin: 0 auto; padding: 0 1rem; }

/* 标签下拉 */
.category-dropdown { position: relative; display: inline-block; margin-bottom: 1rem; z-index: 10; }
.dropdown-trigger { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--c-bg-1); border: 1px solid var(--c-border); border-radius: 8px; cursor: pointer; transition: all 0.2s ease; min-width: 120px; user-select: none; font-size: 0.875rem; }
.dropdown-trigger:hover { border-color: var(--c-primary); box-shadow: 0 2px 8px var(--ld-shadow); }
.dropdown-trigger.active { border-color: var(--c-primary); box-shadow: 0 2px 12px var(--c-primary-soft); }
.selected-content { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
.selected-icon { color: var(--c-text-2); font-size: 1em; flex-shrink: 0; }
.selected-category { font-weight: 500; color: var(--c-text); font-size: 0.875rem; }
.dropdown-icon { color: var(--c-text-2); transition: transform 0.2s ease; font-size: 0.875rem; }
.dropdown-icon.rotated { transform: rotate(180deg); color: var(--c-primary); }
.dropdown-menu { position: absolute; top: 100%; left: 0; right: 0; background: var(--c-bg-1); border: 1px solid var(--c-primary); border-radius: 8px; box-shadow: 0 4px 16px var(--ld-shadow); margin-top: 0.25rem; overflow: hidden; z-index: 1000; min-width: 120px; }
.dropdown-item { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; cursor: pointer; transition: all 0.15s ease; border-bottom: 1px solid var(--c-border-soft); font-size: 0.875rem; }
.dropdown-item:last-child { border-bottom: none; }
.dropdown-item:hover { background: var(--c-primary-soft); }
.dropdown-item.selected { background: var(--c-primary-soft); }
.category-content { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
.category-icon { color: var(--c-text-2); font-size: 1.1em; flex-shrink: 0; }
.category-text { color: var(--c-text); font-size: 0.875rem; flex: 1; }
.check-icon { color: var(--c-primary); font-size: 0.95em; }
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-10px); }
@media (max-width: 768px) { .category-dropdown { width: 100%; } .dropdown-trigger { width: 100%; justify-content: space-between; } .dropdown-menu { width: 100%; left: 0; right: 0; } }

/* 日记卡片 */
.moments-grid { display: flex; flex-direction: column; gap: 1.5rem; }
.moment-card { background: var(--ld-bg-card); backdrop-filter: blur(20px); border-radius: 12px; padding: 1rem; box-shadow: 0 4px 20px var(--ld-shadow), 0 1px 3px var(--ld-shadow); border: 1px solid var(--c-border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.moment-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px var(--ld-shadow), 0 2px 6px var(--ld-shadow); }
.moment-header { display: flex; align-items: flex-start; gap: 0.875rem; margin-bottom: 1rem; }
.author-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.8); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.author-info { flex: 1; min-width: 0; }
.author-main { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.author-name { font-size: 1.1rem; font-weight: 600; color: var(--c-text-1); margin: 0; }
.badges-container { display: flex; align-items: center; gap: 0.375rem; }
.badge { font-size: 0.6875rem; padding: 0.125rem 0.375rem; background: transparent; color: #d4af37; border: 1px solid #d4af37; border-radius: 4px; font-weight: 500; letter-spacing: 0.25px; }
.meta-info { display: flex; align-items: center; gap: 0.25rem; }
.moment-time { font-size: 0.875rem; color: var(--c-text-3); }
.location-separator { color: var(--c-text-3); }
.location { font-size: 0.875rem; color: var(--c-text-3); }
.moment-content { margin-top: 0.5rem; }
.moment-text { font-size: 1rem; line-height: 1.5; color: var(--c-text-1); margin: 0 0 0.5rem 0; word-wrap: break-word; }
.moment-images { margin-top: 0.75rem; }
.single_image .moment-image { width: 100%; max-width: 600px; height: 400px; border-radius: 12px; object-fit: cover; transition: filter 0.3s ease; }
.grid_images { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.grid_item { width: 100%; height: 300px; border-radius: 10px; object-fit: cover; transition: filter 0.3s ease; }
:global(.dark) .single_image .moment-image, :global(.dark) .grid_item { filter: brightness(0.9) contrast(1.05); }
.url-cards { margin-top: 0.75rem; }
.tags { margin-top: 0.75rem; text-align: right; }
.tags span { display: inline-block; margin-left: 0.5rem; font-size: 0.8rem; color: var(--c-primary); }

/* 分页 */
.pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; padding: 1rem; }
.pagination-btn { padding: 0.5rem 1rem; border: 1px solid var(--c-primary); background: transparent; color: var(--c-primary); border-radius: 8px; font-weight: 500; font-size: 0.875rem; cursor: pointer; transition: all 0.2s ease; }
.pagination-btn:hover:not(:disabled) { background: var(--c-primary); color: #fff; }
.pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { color: var(--c-text-3); font-size: 0.875rem; }

/* 图片预览 */
.photo-preview-modal { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(10px); }
.preview-content { position: relative; max-width: 90vw; max-height: 90vh; background: var(--ld-bg-card); border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
.close-btn { position: absolute; top: -50px; right: 0; background: rgba(255, 255, 255, 0.12); border: none; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--c-primary); cursor: pointer; backdrop-filter: blur(20px); transition: all 0.2s ease; z-index: 10; }
.close-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.1); }
.preview-image-container { background: #fff; display: flex; align-items: center; justify-content: center; border-radius: 8px; padding: 20px; width: 1000px; height: 700px; }
.preview-image { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
.nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255, 255, 255, 0.12); border: none; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; color: var(--c-primary); cursor: pointer; backdrop-filter: blur(20px); transition: all 0.2s ease; opacity: 0.8; z-index: 10; box-shadow: 0 0 0 2px var(--c-primary), 0 4px 12px rgba(0, 0, 0, 0.3); }
.nav-btn:hover { background: rgba(255, 255, 255, 0.2); opacity: 1; transform: translateY(-50%) scale(1.1); box-shadow: 0 0 0 3px var(--c-primary), 0 6px 16px rgba(0, 0, 0, 0.4); }
.prev-btn { left: 20px; }
.next-btn { right: 20px; }
.photo-counter { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.9); padding: 0.75rem 2rem; border-radius: 2rem; color: var(--c-primary); font-size: 1.2rem; font-weight: 700; z-index: 10; box-shadow: 0 0 0 2px var(--c-primary), 0 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid var(--c-primary); }
@media (max-width: 768px) {
  .preview-content .close-btn { top: 0.5rem; right: 0.5rem; width: 2.5rem; height: 2.5rem; }
  .nav-btn { width: 50px; height: 50px; }
  .prev-btn { left: 10px; }
  .next-btn { right: 10px; }
  .photo-counter { font-size: 1rem; padding: 0.5rem 1rem; }
  .preview-image-container { width: 90vw; height: 70vh; padding: 15px; }
}
</style>