<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { onMounted, ref, computed } from 'vue'
import 'dayjs/locale/zh-cn'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

dayjs.extend(relativeTime)

// 设置侧边栏组件（复用 memo 页的侧边栏）
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'poetry'])

// API 配置
const API_CONFIG = {
  STEAM_USER_API: 'https://steam-api.zsx815.top/api/steam-user',
  STEAM_GAMES_API: 'https://steam-api.zsx815.top/api/steam-games',
}

// 状态
const loading = ref(true)
const error = ref(false)
const progress = ref(0)

const steamUser = ref<any | null>(null)
const steamGames = ref<any[]>([])

// 统计信息
const totalGamesCount = computed(() => steamGames.value.length)
const recentGamesCount = computed(() =>
  steamGames.value.filter(game => (game.playtimeTwoWeeks ?? 0) > 0).length,
)

const totalPlaytimeHours = computed(() => {
  if (!steamUser.value?.playtimeStats?.totalForever)
    return 0
  return Math.round((steamUser.value.playtimeStats.totalForever / 60) * 10) / 10
})

const recentPlaytimeHours = computed(() => {
  if (!steamUser.value?.playtimeStats?.totalTwoWeeks)
    return 0
  return Math.round((steamUser.value.playtimeStats.totalTwoWeeks / 60) * 10) / 10
})

// 工具函数：分钟转小时字符串
function minutesToHoursText(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0)
    return '0 小时'
  const hours = minutes / 60
  if (hours < 1)
    return `${Math.round(minutes)} 分钟`
  return `${Math.round(hours * 10) / 10} 小时`
}

// 获取 Steam 用户与游戏数据
async function fetchSteamData() {
  try {
    loading.value = true
    error.value = false
    progress.value = 15

    const [userRes, gamesRes] = await Promise.all([
      fetch(API_CONFIG.STEAM_USER_API),
      fetch(API_CONFIG.STEAM_GAMES_API),
    ])

    progress.value = 45

    if (!userRes.ok)
      throw new Error(`User HTTP error: ${userRes.status}`)
    if (!gamesRes.ok)
      throw new Error(`Games HTTP error: ${gamesRes.status}`)

    const userJson = await userRes.json()
    progress.value = 70
    const gamesJson = await gamesRes.json()

    // 兼容接口示例结构
    steamUser.value = userJson?.data?.user || null

    const gamesData = gamesJson?.data?.games
    if (Array.isArray(gamesData?.allGames))
      steamGames.value = gamesData.allGames
    else
      steamGames.value = []

    progress.value = 100
  }
  catch (err) {
    console.error('获取 Steam 数据失败：', err)
    error.value = true
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSteamData()
})
</script>

<template>
  <div class="page-steam">
    <div class="steam-container">
      <Transition name="fade" mode="out-in">
        <!-- 加载中 -->
        <div v-if="loading" class="steam-loading-container">
          <div class="steam-loading-header">
            正在从 Steam 加载数据...
          </div>
          <div class="steam-progress-bar">
            <div class="steam-progress" :style="{ width: `${progress}%` }" />
          </div>
          <p class="steam-loading-subtext">
            请稍候，正在获取 Steam 用户与游戏信息
          </p>
        </div>

        <!-- 错误态 -->
        <div v-else-if="error" class="error-container">
          <Icon name="line-md:alert" class="error-icon" />
          <p>加载失败，请刷新页面重试</p>
        </div>

        <!-- 主内容 -->
        <div v-else class="steam-main">
          <!-- 用户资料区域 -->
          <div v-if="steamUser" class="profile">
            <div class="header">
              <img
                class="avatar"
                :src="steamUser.avatar?.large || steamUser.avatar?.medium"
                :alt="steamUser.username"
              >
              <div class="info">
                <div class="row">
                  <h2 class="username">
                    {{ steamUser.username }}
                    <Icon name="mdi:steam" class="verified" />
                  </h2>
                </div>
                <div class="row">
                  <span class="bio">
                    Steam 等级：{{ steamUser.level ?? '-' }} · 状态：{{ steamUser.statusMessage || steamUser.status || '未知' }}
                  </span>
                </div>
                <div class="row">
                  <a
                    v-if="steamUser.profileUrl"
                    class="profile-link"
                    :href="steamUser.profileUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看 Steam 个人主页
                  </a>
                </div>
                <span class="bio">
                  最近两周游戏时长：{{ recentPlaytimeHours }} 小时 · 累计：{{ totalPlaytimeHours }} 小时
                </span>
              </div>
            </div>
          </div>

          <!-- 统计卡片区域 -->
          <div class="overview">
            <div class="stat-card">
              <Icon name="material-symbols:videogame-asset" class="stat-icon" />
              <div class="stat-info">
                <div class="stat-label">
                  游戏总数
                </div>
                <div class="stat-value">
                  {{ totalGamesCount }}
                </div>
              </div>
            </div>

            <div class="stat-card">
              <Icon name="line-md:timer-twotone" class="stat-icon" />
              <div class="stat-info">
                <div class="stat-label">
                  累计游玩
                </div>
                <div class="stat-value">
                  {{ totalPlaytimeHours }} 小时
                </div>
              </div>
            </div>

            <div class="stat-card">
              <Icon name="material-symbols:local-fire-department" class="stat-icon" />
              <div class="stat-info">
                <div class="stat-label">
                  最近游玩的游戏数
                </div>
                <div class="stat-value">
                  {{ recentGamesCount }}
                </div>
              </div>
            </div>
          </div>

          <!-- 游戏列表 -->
          <div class="games-list">
            <div
              v-for="(game, index) in steamGames"
              :key="game.appid"
              class="game-item"
              :style="{ '--delay': `${index * 0.05}s` }"
            >
              <div class="game-meta">
                <img
                  v-if="game.images?.icon"
                  class="game-icon"
                  :src="game.images.icon"
                  :alt="game.name"
                >
                <div class="info">
                  <div class="game-name">
                    {{ game.name }}
                  </div>
                  <div class="game-stat-line">
                    <span>
                      累计：{{ minutesToHoursText(game.playtimeForever) }}
                    </span>
                    <span>
                      最近两周：{{ minutesToHoursText(game.playtimeTwoWeeks) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="game-extra">
                <span v-if="(game.playtimeTwoWeeks ?? 0) > 0" class="tag hot">
                  最近游玩
                </span>
                <span v-else class="tag">
                  暂无近期游玩
                </span>
              </div>
            </div>

            <div class="games-footer" v-if="steamGames.length > 0">
              <p>共 {{ totalGamesCount }} 款游戏，按 Steam API 返回顺序展示</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-steam {
  margin: 1rem;
  animation: float-in 0.2s backwards;

  .steam-container {
    .steam-main {
      display: flex;
      flex-direction: column;
    }

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
          background-color: var(--c-primary);
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

          .profile-link {
            font-size: 0.9rem;
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

  .overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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

  .games-list {
    margin-top: 1rem;

    .game-item {
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 0 0 1px var(--c-bg-soft);
      margin-bottom: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      animation: float-in 0.3s backwards;
      animation-delay: var(--delay);
    }

    .game-meta {
      display: flex;
      align-items: center;
      gap: 10px;

      .game-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
        box-shadow: 2px 4px 1rem var(--ld-shadow);
      }

      .info {
        .game-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--c-text);
        }

        .game-stat-line {
          margin-top: 0.25rem;
          font-size: 0.85rem;
          color: var(--c-text-3);
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
      }
    }

    .game-extra {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--c-text-3);

      .tag {
        background-color: var(--c-bg-2);
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 0.75rem;

        &.hot {
          background-color: rgba(255, 99, 71, 0.1);
          color: #ff6347;
        }
      }
    }

    .games-footer {
      text-align: center;
      padding: 2rem 0;
      color: var(--c-text-3);
      font-size: 0.9rem;
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

    .error-icon {
      font-size: 4rem;
      color: var(--c-danger);
    }
  }
}
</style>
