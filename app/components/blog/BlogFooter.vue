<script setup lang="ts">
import feeds from '../../feeds'

const appConfig = useAppConfig()

/* 当前年份 */
const currentYear = new Date().getFullYear()

/* 随机友链 */
const randomFeeds = ref<any[]>([])
function initializeRandomFeeds() {
  const allFeeds = feeds.flatMap((g: any) =>
    g.entries.map((e: any) => ({
      text: e.author,
      url: e.link,
      icon: 'ph:link-bold',
    })),
  )
  randomFeeds.value = [...allFeeds].sort(() => 0.5 - Math.random()).slice(0, 4)
}

/* 一言 */
const hitokoto = ref('')
const showHitokoto = ref(false)
async function fetchHitokoto() {
  try {
    const r = await fetch('https://v1.hitokoto.cn/?c=f&encode=text')
    hitokoto.value = await r.text()
  } catch {
    hitokoto.value = '暂无法获取一言...'
  } finally {
    showHitokoto.value = true
  }
}

/* 初始化 */
initializeRandomFeeds()
fetchHitokoto()

interface UmamiStatsResponse {
  today_uv: number | null
  today_pv: number | null
  yesterday_uv: number | null
  yesterday_pv: number | null
  last_month_pv: number | null
  last_year_pv: number | null
  online_users: number | null
}

const umamiStats = ref<UmamiStatsResponse | null>(null)

async function fetchUmamiStats() {
  const url = (appConfig as any).analytics?.umamiStatsApi as string | undefined

  if (!import.meta.client || !url)
    return

  try {
    const res = await fetch(url)
    if (!res.ok)
      throw new Error(`Failed to fetch Umami stats: ${res.status}`)

    umamiStats.value = await res.json()
  }
  catch (error) {
    console.error('Failed to load Umami stats:', error)
  }
}

onMounted(() => {
  fetchUmamiStats()
})

/* 刷新友链 */
function refreshFeeds() {
  initializeRandomFeeds()
}
</script>

<template>
<footer class="blog-footer">
  <nav class="footer-nav">
    <div
      v-for="(group, idx) in appConfig.footer.nav"
      :key="idx"
      class="footer-nav-group"
    >
      <h3 v-if="group.title">{{ group.title }}</h3>
      <menu>
        <li v-for="(it, i) in group.items" :key="i">
          <UtilLink :to="it.url">
            <Icon :name="it.icon" />
            <span class="nav-text">{{ it.text }}</span>
          </UtilLink>
        </li>
      </menu>
    </div>
  </nav>

  <!-- 单行友链 -->
  <div class="footer-nav-group friends-line">
    <h3>友链</h3>
    <button
      aria-label="刷新"
      class="refresh-button"
      title="刷新友链"
      @click="refreshFeeds"
    >
      <Icon name="ph:arrow-clockwise-bold" />
    </button>

    <UtilLink
      v-for="(f, i) in randomFeeds"
      :key="i"
      :to="f.url"
      external
      class="friend-link"
    >
      <Icon :name="f.icon" />
      <span>{{ f.text }}</span>
    </UtilLink>

    <UtilLink to="/link" external class="friend-link">
      <span>更多…</span>
    </UtilLink>
  </div>

  <!-- 版权条（直接搬过来的） -->
  <div class="copyright-bar">
    <div class="time-line">
      <span class="power-by">
        ©{{ appConfig.timeStart }} — {{ currentYear }} Powerby
      </span>
      <a
        class="copyright-link"
        :href="appConfig.url"
        :title="appConfig.title"
        target="_blank"
        rel="noopener"
      >
        <img
          class="logo"
          :alt="appConfig.title"
          :src="appConfig.header.logo"
          :class="{ circle: appConfig.header.showTitle }"
          width="25"
          height="25"
          loading="lazy"
        />
        <span class="title">{{ appConfig.title }}</span>
      </a>
      <div v-if="umamiStats" class="footer-stats">
        <Icon name="material-symbols:insights" />
        <span class="footer-stats-item">
          今日 PV {{ umamiStats.today_pv ?? '—' }}
        </span>
        <span class="footer-stats-item">
          UV {{ umamiStats.today_uv ?? '—' }}
        </span>
        <span v-if="umamiStats.online_users != null" class="footer-stats-item">
          在线 {{ umamiStats.online_users }}
        </span>
      </div>
    </div>
    <div class="theme-line">
      <span>采用</span>
      <a href="https://github.com/L33Z22L11/blog-v3" target="_blank" rel="noopener">
        {{ appConfig.other.Themes_Info }}
      </a>
      <span>主题</span>
    </div>
  </div>

  <!-- 一言 -->
  <p class="hitokoto" :class="{ 'hitokoto-fade-in': showHitokoto }">
    {{ hitokoto }}
  </p>
</footer>
</template>

<style lang="scss" scoped>
.blog-footer {
  margin: 3rem 1rem;
  font-size: 0.9em;
  color: var(--c-text-2);

  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 5vw clamp(2rem, 5%, 5vw);
    padding-block: 3rem;

    h3 { margin: 0.5em; font: inherit; }

    a {
      display: flex;
      align-items: center;
      gap: 0.3em;
      width: fit-content;
      padding: 0.3em 0.5em;
      border-radius: 0.5em;
      font-size: 0.9em;
      transition: background-color 0.2s, color 0.1s;
      &:hover { background-color: var(--c-bg-soft); color: var(--c-text); }
    }
  }

  p { margin: 0.5em; }

  /* 刷新按钮 */
  .refresh-button {
    padding: 0.16em;
    border: none;
    border-radius: 0.3em;
    background: none;
    color: var(--c-text-2);
    cursor: pointer;
    transition: background-color 0.2s, color 0.1s;
    &:hover { background-color: var(--c-bg-soft); color: var(--c-text); }
  }

  /* 单行友链 */
  .friends-line {
    display: flex;
    align-items: center;
    gap: 0.6em;
    flex-wrap: wrap;
    h3 { margin: 0; font-size: 0.9em; }
    .friend-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3em;
      padding: 0.3em 0.5em;
      border-radius: 0.5em;
      font-size: 0.9em;
      transition: background-color 0.2s, color 0.1s;
      &:hover { background-color: var(--c-bg-soft); color: var(--c-text); }
    }
  }

  /* 版权条 */
  .copyright-bar {
    margin: 1rem 0;
    font-size: 0.9em;
    color: var(--c-text-secondary);
    .time-line,
    .theme-line {
      display: flex;
      align-items: center;
      gap: 0.4em;
      flex-wrap: wrap;
    }
    .copyright-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3em;
      padding: 0.3em 0.5em;
      border-radius: 0.5em;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s;
      &:hover { opacity: 0.8; }
      .logo {
        width: 25px;
        height: 25px;
        min-width: 25px;
        min-height: 25px;
        border-radius: 50%;
        object-fit: cover;
        &.circle { border-radius: 50%; }
      }
      .title { font-size: 1em; font-weight: 500; }
    }
  }

  /* 一言 */
  .hitokoto { color: var(--c-text-3); }
  .hitokoto-fade-in { animation: fade-in 0.5s ease-in-out; }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .footer-stats {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.85em;
    color: var(--c-text-3);
  }

  .footer-stats-item + .footer-stats-item {
    margin-left: 0.3em;
  }

  .footer-stats :deep(svg) {
    font-size: 1rem;
    color: var(--c-primary);
  }
}
</style>
