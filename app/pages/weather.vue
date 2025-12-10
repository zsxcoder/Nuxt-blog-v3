<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const layoutStore = useLayoutStore()

// 设置侧边栏组件
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'poetry'])

/* ---------- Emoji 映射 ---------- */
const WEATHER_EMOJI: Record<string, string> = {
	晴: '☀️',
	多云: '⛅',
	阴: '☁️',
	小雨: '🌧️',
	中雨: '🌧️',
	大雨: '⛈️',
	雪: '❄️',
	雾: '🌫️',
	霾: '😷',
}
function getEmoji(condition = '', code = '') {
	return WEATHER_EMOJI[condition] || WEATHER_EMOJI[code] || '🌈'
}
/* 如果想用 yesicon，把上面换成下面即可 */
// function getIconName(code: string) {
//   return `weather:${code.padStart(2, '0')}`
// }

/* ---------- 状态 ---------- */
const loading = ref(true)
const error = ref(false)
const progress = ref(0)
const location = ref({ name: '', province: '', city: '' })
const hourlyForecast = ref<any[]>([])
const dailyForecast = ref<any[]>([])
const sunSeries = ref<any[]>([])

/* ---------- 计算 ---------- */
const updatedAt = computed(() => dayjs().format('MM-DD HH:mm'))
const nowTemp = computed(() => {
	const first = hourlyForecast.value[0]
	return first ? first.temperature : '-'
})
const currentAir = computed(() => {
	const today = dailyForecast.value[0]
	return today ? `${today.air_quality} ${today.aqi}` : '-'
})
const aqiColor = computed(() => {
	const today = dailyForecast.value[0]
	if (!today)
		return '#999'
	return ['#00e400', '#ff0', '#ff7e00', '#f00', '#99004c', '#7e0023'][today.aqi_level] || '#999'
})
const sunToday = computed(() => {
	const today = sunSeries.value[0]
	return today ? `${today.sunrise_desc} / ${today.sunset_desc}` : '-'
})

/* ---------- 获取数据 ---------- */
async function fetchWeather() {
	try {
		loading.value = true
		error.value = false
		progress.value = 30
		const res = await fetch(
			'https://60s.kemeow.top/v2/weather/forecast?days=7&encoding=json&query=%E5%8D%97%E4%BA%AC%E5%B8%82',
		)
		if (!res.ok)
			throw new Error('网络错误')
		progress.value = 70
		const json = await res.json()
		location.value = json.data.location
		sunSeries.value = json.data.sunrise_sunset
		hourlyForecast.value = json.data.hourly_forecast.map((h: any) => ({
			...h,
			time: dayjs(h.datetime).format('HH:mm'),
		}))
		dailyForecast.value = json.data.daily_forecast.map((d: any) => ({
			...d,
			dateFmt: dayjs(d.date).format('MM-DD dddd'),
		}))
		progress.value = 100
	}
	catch (e) {
		console.error(e)
		error.value = true
	}
	finally {
		loading.value = false
	}
}

onMounted(() => fetchWeather())
</script>

<template>
<div class="page-weather">
	<div class="talk-container">
		<!-- 加载中 -->
		<div v-if="loading" class="steam-loading-container">
			<div class="steam-loading-header">
				加载天气中...
			</div>
			<div class="steam-progress-bar">
				<div class="steam-progress" :style="{ width: `${progress}%` }" />
			</div>
			<p class="steam-loading-subtext">
				正在获取天气数据...
			</p>
		</div>

		<!-- 错误 -->
		<div v-else-if="error" class="error-container">
			<Icon name="line-md:alert" class="error-icon" />
			<p>天气加载失败，请刷新页面重试</p>
		</div>

		<!-- 正文 -->
		<div v-else class="talk-main">
			<!-- 当前位置 & 更新时间 -->
			<div class="profile">
				<div class="header">
					<img
						class="avatar"
						src="https://gravatar.mcyzsx.top/avatar/me"
						alt="天气图标"
					>
					<div class="info">
						<h2 class="username">
							{{ location.name }}
							<Icon name="material-symbols:location-on" class="verified" />
						</h2>
						<span class="bio">本地天气预报 · 7 天展望</span>
						<span class="bio">更新于 {{ updatedAt }}</span>
					</div>
				</div>
			</div>

			<!-- 统计卡片 -->
			<div class="overview">
				<div class="stat-card">
					<Icon name="material-symbols:air" class="stat-icon" />
					<div class="stat-info">
						<div class="stat-label">
							空气质量
						</div>
						<div class="stat-value" :style="{ color: aqiColor }">
							{{ currentAir }}
						</div>
					</div>
				</div>
				<div class="stat-card">
					<Icon name="material-symbols:thermostat" class="stat-icon" />
					<div class="stat-info">
						<div class="stat-label">
							当前气温
						</div>
						<div class="stat-value">
							{{ nowTemp }}°
						</div>
					</div>
				</div>
				<div class="stat-card">
					<Icon name="material-symbols:wb-sunny" class="stat-icon" />
					<div class="stat-info">
						<div class="stat-label">
							日出 / 日落
						</div>
						<div class="stat-value">
							{{ sunToday }}
						</div>
					</div>
				</div>
			</div>

			<!-- 逐小时 -->
			<section class="section">
				<h3 class="section-title">
					<Icon name="material-symbols:schedule" /> 24 小时
				</h3>
				<div class="hourly-wrap">
					<div
						v-for="h in hourlyForecast"
						:key="h.datetime"
						class="hourly-item"
					>
						<span class="hourly-time">{{ h.time }}</span>
						<!-- Emoji 图标 -->
						<span class="emoji hourly-icon">{{ getEmoji(h.condition, h.condition_code) }}</span>
						<span class="hourly-temp">{{ h.temperature }}°</span>
					</div>
				</div>
			</section>

			<!-- 7 天 -->
			<section class="section">
				<h3 class="section-title">
					<Icon name="material-symbols:calendar-month" /> 7 天预报
				</h3>
				<div class="daily-list">
					<div
						v-for="(d, idx) in dailyForecast"
						:key="d.date"
						class="daily-item"
						:style="{ '--delay': idx }"
					>
						<div class="daily-left">
							<span class="daily-date">{{ d.dateFmt }}</span>
							<span class="daily-desc">
								{{ d.day_condition }} / {{ d.night_condition }}
							</span>
						</div>
						<div class="daily-right">
							<!-- Emoji 图标 -->
							<span class="emoji daily-icon">{{ getEmoji(d.day_condition, d.day_condition_code) }}</span>
							<span class="daily-temp">
								{{ d.max_temperature }}° / {{ d.min_temperature }}°
							</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.page-weather {
  margin: 1rem;
  animation: float-in 0.2s backwards;

  .talk-main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ---------- 加载 & 错误 ---------- */
  .steam-loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    color: var(--c-text-2);
    gap: 16px;
  }
  .steam-progress-bar {
    width: 80%;
    height: 5px;
    background: var(--c-bg-soft);
    border-radius: 5px;
    overflow: hidden;
    .steam-progress {
      height: 100%;
      background: var(--c-primary);
      transition: width 0.3s ease;
    }
  }
  .error-icon {
    font-size: 4rem;
    color: var(--c-danger);
  }

  /* ---------- 用户信息 ---------- */
  .profile {
    background: var(--ld-bg-card);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    display: flex;
    gap: 1em;
    animation: float-in 0.3s backwards;
    .header {
      display: flex;
      gap: 1em;
      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--c-primary);
      }
      .username {
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        .verified {
          color: var(--c-primary);
        }
      }
      .bio {
        font-size: 0.9rem;
        color: var(--c-text-2);
      }
    }
  }

  /* ---------- 统计卡片 ---------- */
  .overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    .stat-card {
      background: var(--ld-bg-card);
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 0 0 1px var(--c-bg-soft);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: float-in 0.3s backwards;
      .stat-icon {
        font-size: 2rem;
        color: var(--c-primary);
      }
      .stat-label {
        font-size: 0.85rem;
        color: var(--c-text-2);
      }
      .stat-value {
        font-size: 1.3rem;
        font-weight: bold;
      }
    }
  }

  /* ---------- 区块标题 ---------- */
  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--c-text);
  }

  /* ---------- 逐小时 ---------- */
  .hourly-wrap {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 8px;
    .hourly-item {
      flex: 0 0 60px;
      background: var(--ld-bg-card);
      border-radius: 10px;
      box-shadow: 0 0 0 1px var(--c-bg-soft);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.6rem 0.4rem;
      gap: 6px;
      font-size: 0.8rem;
      .hourly-icon {
        font-size: 32px;
      }
      .hourly-temp {
        font-weight: bold;
      }
    }
  }

  /* ---------- 7 天 ---------- */
  .daily-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    .daily-item {
      background: var(--ld-bg-card);
      border-radius: 10px;
      box-shadow: 0 0 0 1px var(--c-bg-soft);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      animation: float-in 0.3s backwards;
      animation-delay: calc(var(--delay, 0) * 0.1s);
      .daily-left {
        display: flex;
        flex-direction: column;
        .daily-date {
          font-weight: 600;
        }
        .daily-desc {
          font-size: 0.85rem;
          color: var(--c-text-2);
        }
      }
      .daily-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .daily-icon {
          font-size: 36px;
        }
        .daily-temp {
          font-weight: bold;
        }
      }
    }
  }
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
