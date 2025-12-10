<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const rawUrl = computed(() => (route.query.url as string) || '')

const decodedUrl = computed(() => {
  if (!rawUrl.value)
    return ''
  try {
    return decodeURIComponent(rawUrl.value)
  }
  catch {
    // 如果解码失败，回退使用原始字符串，保证按钮依然可用
    return rawUrl.value
  }
})

const isValidExternal = computed(() => {
  if (!decodedUrl.value)
    return false
  try {
    const u = new URL(decodedUrl.value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  }
  catch {
    return false
  }
})

const domain = computed(() => {
  if (!isValidExternal.value)
    return ''
  try {
    return new URL(decodedUrl.value).hostname
  }
  catch {
    return ''
  }
})

const countdownSeconds = 5
const countdown = ref(countdownSeconds)
let countdownTimer: number | null = null

onMounted(() => {
  if (!isValidExternal.value)
    return

  countdown.value = countdownSeconds

  countdownTimer = window.setInterval(() => {
    if (countdown.value <= 1) {
      clearCountdown()
      proceed()
    }
    else {
      countdown.value -= 1
    }
  }, 1000)
})

onUnmounted(() => {
  clearCountdown()
})

function clearCountdown() {
  if (countdownTimer != null) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function proceed() {
  const target = decodedUrl.value || rawUrl.value
  if (!target)
    return

  clearCountdown()
  window.location.href = target
}

function goBack() {
  clearCountdown()

  // 如果是通过 window.open 打开的新标签页，优先尝试关闭自己
  if (window.opener && window.opener !== window) {
    window.close()
    return
  }

  // 有历史记录就正常返回
  if (history.length > 1) {
    history.back()
    return
  }

  // 没有历史时，尝试根据同源 referrer 返回
  if (document.referrer) {
    try {
      const ref = new URL(document.referrer)
      if (ref.origin === window.location.origin) {
        router.push(ref.pathname + ref.search + ref.hash)
        return
      }
    }
    catch {
      // ignore
    }
  }

  // 兜底：回首页
  router.push('/')
}
</script>

<template>
  <div class="go-page">
    <div class="go-card">
      <h1 class="go-title">即将离开本站</h1>
      <p class="go-desc">
        你将要访问的外部链接：
      </p>
      <p v-if="isValidExternal" class="go-url">{{ decodedUrl }}</p>
      <p v-else class="go-url invalid">链接无效或缺失</p>

      <p v-if="isValidExternal" class="go-domain">
        目标站点：<strong>{{ domain }}</strong>
      </p>

      <div class="go-actions">
        <button type="button" class="btn secondary" @click="goBack">
          返回上一页
        </button>
        <button
          type="button"
          class="btn primary"
          @click="proceed"
        >
          继续访问<span v-if="domain"> {{ domain }}</span>
        </button>
      </div>

      <p v-if="isValidExternal" class="go-countdown">
        {{ countdown }} 秒后将自动跳转，如不希望跳转，请点击「返回上一页」
      </p>

      <p class="go-tip">
        外部网站内容与本博客无关，请注意辨别信息和账号安全。
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.go-page {
  min-height: calc(100vh - 6rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.go-card {
  max-width: 600px;
  width: 100%;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  background: var(--ld-bg-card);
  box-shadow: 0 8px 30px var(--ld-shadow);
  border: 1px solid var(--c-border);
}

.go-title {
  margin: 0 0 1rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--c-text);
}

.go-desc {
  margin: 0 0 .5rem;
  color: var(--c-text-2);
  font-size: .95rem;
}

.go-url {
  padding: .75rem 1rem;
  border-radius: .6rem;
  background: var(--c-bg-soft);
  font-family: var(--font-monospace);
  font-size: .9rem;
  word-break: break-all;
  margin: 0 0 .75rem;

  &.invalid {
    color: var(--c-danger);
  }
}

.go-domain {
  margin: 0 0 1.5rem;
  font-size: .95rem;
  color: var(--c-text-2);
}

.go-countdown {
  margin: 0 0 .75rem;
  font-size: .85rem;
  color: var(--c-text-2);
}

.go-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn {
  flex: 1;
  padding: .6rem 1rem;
  border-radius: .6rem;
  border: 1px solid transparent;
  font-size: .95rem;
  cursor: pointer;
  transition: all .2s ease;

  &.primary {
    background: var(--c-primary);
    color: #fff;

    &:hover:not(:disabled) {
      filter: brightness(1.05);
    }

    &:disabled {
      opacity: .6;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: transparent;
    color: var(--c-text);
    border-color: var(--c-border);

    &:hover {
      background: var(--c-bg-soft);
    }
  }
}

.go-tip {
  margin: 0;
  font-size: .85rem;
  color: var(--c-text-3);
}

@media (max-width: 600px) {
  .go-card {
    padding: 1.5rem 1.25rem;
  }

  .go-actions {
    flex-direction: column;
  }
}
</style>
