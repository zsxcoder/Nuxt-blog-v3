<!-- about.vue -->
<template>
  <!-- 外链样式 -->
  <link href="/assets/css/about.css" rel="stylesheet">

  <div id="about-page" style="margin-top:1rem;margin-left:1rem;margin-right:1rem;">
    <!-- 顶部作者信息 -->
    <Author />

    <div class="author-page-content">
      <!-- 第 1 行：打招呼 -->
      <div class="author-content">
        <MyInfoAndSayHello />
      </div>

      <!-- 第 2 行：站点提示 + 格言 -->
      <div class="author-content">
        <Aboutsitetips />
        <Maxim />
      </div>

      <!-- 第 3 行：技能 -->
      <div class="author-content">
        <Skillinfo />
      </div>

      <!-- 第 4 行：社交卡片（已重构） -->
      <div class="author-content">
        <div class="author-content-item social">
          <h3 class="author-title">联系我</h3>
          <div class="social-list">
            <ZButton
              v-tip="'邮箱'"
              class="social-link"
              icon="ph:envelope-simple-bold"
              to="mailto:me@mcyzsx.top"
            />
            <ZButton
              v-tip="'QQ'"
              class="social-link"
              icon="ri:qq-line"
              to="https://qm.qq.com/q/Ha1GZQtMgE"
            />
            <ZButton
              v-tip="'哔哩哔哩'"
              class="social-link"
              icon="ri:bilibili-fill"
              to="https://space.bilibili.com/3546643173477234"
            />
            <ZButton
              v-tip="'Telegram'"
              class="social-link"
              icon="ph:telegram-logo-bold"
              to="https://t.me/KemiaoJun"
            />
            <ZButton
              v-tip="'网易云'"
              class="social-link"
              icon="ri:netease-cloud-music-line"
              to="https://music.163.com/#/playlist?id=13681647281"
            />
            <ZButton
              v-tip="'X'"
              class="social-link"
              icon="ph:x-logo-bold"
              to="https://x.com/kemiao"
            />
          </div>
        </div>
      </div>

      <!-- 第 5 行：技术 + 游戏 -->
      <div class="author-content row">
        <Technology />
        <Game />
      </div>

      <!-- 第 6 行：站点统计 -->
      <div class="author-content">
        <Umami />
      </div>

      <!-- 第 7 行：单曲 -->
      <div class="author-content">
        <Single />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ----------------- 组件引用 ----------------- */
import Aboutsitetips from '~/components/about/aboutsitetips.vue'
import Author from '~/components/about/author.vue'
import Game from '~/components/about/game.vue'
import Maxim from '~/components/about/maxim.vue'
import MyInfoAndSayHello from '~/components/about/myInfoAndSayHello.vue'
import Umami from '~/components/about/umami.vue'
import Single from '~/components/about/single.vue'
import Skillinfo from '~/components/about/skillinfo.vue'
import Technology from '~/components/about/technology.vue'

/* ----------------- 布局 store ----------------- */
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'weather', 'blog-tech', 'latest-comments', 'comm-group', 'poetry'])

/* ----------------- 客户端脚本 ----------------- */
onMounted(async () => {
  if (process.client) {
    function loadScript(url: string, callback?: () => void) {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) { resolve(); return }
        const script = document.createElement('script')
        script.src = url
        script.type = 'text/javascript'
        script.async = true
        script.onload = () => { callback?.(); resolve() }
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    loadScript('/js/about.js')
      .then(() => console.log('友链顶部重要JS加载完毕'))
      .catch(err => console.error('友链顶部重要JS加载失败', err))
  }
})
</script>

<style lang="scss" scoped>
/* ===== 社交卡片 ===== */
.author-content-item.social {
  width: 100%;
  text-align: center;
}

.social-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--c-bg-1);
  border: 1px solid var(--c-border);
  color: var(--c-text-1);
  font-size: 1.5rem;
  transition: all .25s ease;
  box-shadow: var(--heo-shadow-border);

  &:hover {
    background: var(--c-bg-soft);
    color: var(--c-primary, var(--c-text));
    transform: translateY(-2px);
  }
}

/* 移动端微调 */
@media screen and (max-width: 768px) {
  .social-list { gap: .75rem; }
  .social-link {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
  }
}
</style>