<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'latest-comments', 'comm-group', 'poetry'])

useSeoMeta({
  title: '赞助支持',
  description: `${appConfig.title} 的赞助支持页面，欢迎通过多种方式支持我的创作。`,
  ogType: 'website',
})

interface SponsorItem {
  name: string
  amount: string
  date?: string
  avatar?: string
}

const sponsors: SponsorItem[] = []
</script>

<template>
  <div class="page-sponsor">
    <header class="page-header">
      <div class="page-header-icon">
        <Icon name="material-symbols:favorite" />
      </div>
      <div class="page-header-text">
        <h1>赞助支持</h1>
        <p>
          如果你觉得这里的内容对你有帮助，欢迎通过下列方式支持我的创作。
          每一份支持，都是我继续折腾和更新的动力。
        </p>
      </div>
    </header>

    <section class="sponsor-card">
      <div class="sponsor-intro">
        <p>
          赞助将主要用于网站维护、服务器与存储费用，以及继续折腾各种有意思的小项目。
        </p>
        <p>
          你可以选择支付宝或微信扫码赞助，也可以通过其它方式支持，哪怕只是帮我把博客分享给更多人，也是一种非常大的支持。
        </p>
      </div>

      <div class="donate-grid">
        <div class="donate-card">
          <div class="donate-card-header">
            <div class="donate-icon alipay">
              <Icon name="simple-icons:alipay" />
            </div>
            <div>
              <h2>支付宝</h2>
              <p>扫码支付</p>
            </div>
          </div>
          <div class="donate-qr">
            <img src="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/alipay.webp" alt="支付宝赞助二维码">
          </div>
        </div>

        <div class="donate-card">
          <div class="donate-card-header">
            <div class="donate-icon wechat">
              <Icon name="simple-icons:wechat" />
            </div>
            <div>
              <h2>微信支付</h2>
              <p>扫码支付</p>
            </div>
          </div>
          <div class="donate-qr">
            <img src="https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/weixin.webp" alt="微信赞助二维码">
          </div>
        </div>
      </div>
    </section>

    <section class="sponsor-card">
      <h2 class="section-title">其他支持方式</h2>
      <div class="support-grid">
        <div class="support-card">
          <div class="support-card-header">
            <Icon name="material-symbols:share" />
            <span>分享推荐</span>
          </div>
          <p>
            把这个博客分享给你觉得可能感兴趣的朋友，或者放到自己的友链里。
          </p>
        </div>

        <div class="support-card">
          <div class="support-card-header">
            <Icon name="material-symbols:comment" />
            <span>留言互动</span>
          </div>
          <p>
            在文章下留言、提建议、纠错或简单聊聊天，都是对我很大的鼓励。
          </p>
        </div>

        <div class="support-card">
          <div class="support-card-header">
            <Icon name="material-symbols:star" />
            <span>关注订阅</span>
          </div>
          <p>
            订阅 RSS、关注社交媒体，或者给相关项目仓库点一个 Star。
          </p>
        </div>
      </div>
    </section>

    <section class="sponsor-card sponsors-section">
      <div class="sponsors-header">
        <h2 class="section-title">
          <Icon name="material-symbols:group" />
          <span>已赞助的小伙伴</span>
        </h2>
        <p class="sponsors-tip">
          如果你已经赞助，并希望出现在这里，可以在仓库里发起 PR 或直接联系我。
        </p>
      </div>

      <div v-if="sponsors.length" class="sponsors-grid">
        <div
          v-for="sponsor in sponsors"
          :key="sponsor.name + sponsor.date"
          class="sponsor-card"
        >
          <div class="sponsor-card-inner">
            <div class="sponsor-avatar">
              <img
                v-if="sponsor.avatar"
                :src="sponsor.avatar"
                :alt="`${sponsor.name} 的头像`"
                loading="lazy"
              >
              <Icon
                v-else
                name="material-symbols:person"
              />
            </div>
            <div class="sponsor-info">
              <div class="sponsor-name">{{ sponsor.name }}</div>
              <div v-if="sponsor.date" class="sponsor-date">{{ sponsor.date }}</div>
            </div>
            <div class="sponsor-amount">{{ sponsor.amount }}</div>
          </div>
        </div>
      </div>
      <p v-else class="sponsors-empty">
        还没有赞助记录，欢迎成为第一位赞助者～
      </p>
    </section>

    <PostComment />
  </div>
</template>

<style scoped lang="scss">
.page-sponsor {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 2.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0 1.5rem;

  .page-header-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    background: var(--c-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4px 12px var(--ld-shadow);

    :deep(svg) {
      font-size: 1.7rem;
    }
  }

  .page-header-text {
    h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      color: var(--c-text);
    }

    p {
      margin: 0.3rem 0 0;
      color: var(--c-text-2);
      font-size: 0.98rem;
    }
  }
}

.sponsor-card {
  background: var(--ld-bg-card);
  border-radius: 1rem;
  border: 1px solid var(--c-border);
  padding: 1.75rem 1.75rem 2rem;
  box-shadow: 0 4px 20px var(--ld-shadow);
  margin-bottom: 1.75rem;
}

.sponsor-intro {
  font-size: 0.98rem;
  color: var(--c-text-2);
  line-height: 1.7;
  margin-bottom: 1.5rem;

  p + p {
    margin-top: 0.6rem;
  }
}

.donate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.donate-card {
  border-radius: 0.9rem;
  border: 1px solid var(--c-border);
  background: var(--ld-bg-card);
  padding: 1.25rem 1.25rem 1.5rem;
  box-shadow: 0 2px 10px var(--ld-shadow);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px var(--ld-shadow);
    border-color: var(--c-primary-soft);
  }
}

.donate-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--c-text);
  }

  p {
    margin: 0.2rem 0 0;
    font-size: 0.85rem;
    color: var(--c-text-2);
  }
}

.donate-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  &.alipay {
    background: #1677ff;
  }

  &.wechat {
    background: #22c55e;
  }

  :deep(svg) {
    font-size: 1.6rem;
  }
}

.donate-qr {
  text-align: center;

  img {
    width: 11rem;
    height: 11rem;
    max-width: 100%;
    border-radius: 0.75rem;
    object-fit: cover;
    border: 1px solid var(--c-border);
    background: var(--c-bg);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: var(--c-text);

  :deep(svg) {
    font-size: 1.5rem;
    color: var(--c-primary);
  }
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.support-card {
  border-radius: 0.8rem;
  background: var(--c-bg-soft);
  padding: 0.9rem 1rem;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: color-mix(in srgb, var(--c-bg-soft) 70%, var(--c-primary-soft) 30%);
    transform: translateY(-1px);
    box-shadow: 0 3px 12px var(--ld-shadow);
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: var(--c-text-2);
  }
}

.support-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  span {
    font-weight: 600;
    color: var(--c-text);
  }

  :deep(svg) {
    font-size: 1.2rem;
    color: var(--c-primary);
  }
}

.sponsors-section {
  margin-bottom: 1.5rem;
}

.sponsors-header {
  margin-bottom: 1rem;

  .sponsors-tip {
    margin: 0.2rem 0 0;
    font-size: 0.85rem;
    color: var(--c-text-3);
  }
}

.sponsors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.sponsor-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px var(--ld-shadow);
  }
}

.sponsor-card-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.8rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
}

.sponsor-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  overflow: hidden;
  background: var(--c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :deep(svg) {
    font-size: 1.4rem;
    color: var(--c-text-2);
  }
}

.sponsor-info {
  flex: 1;
  min-width: 0;

  .sponsor-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--c-text);
  }

  .sponsor-date {
    font-size: 0.8rem;
    color: var(--c-text-3);
    margin-top: 0.1rem;
  }
}

.sponsor-amount {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-primary);
}

.sponsors-empty {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: var(--c-text-3);
}

@media (max-width: 768px) {
  .page-header {
    align-items: flex-start;

    .page-header-text h1 {
      font-size: 1.7rem;
    }
  }

  .sponsor-card {
    padding: 1.25rem 1.25rem 1.6rem;
  }

  .donate-qr img {
    width: 9.5rem;
    height: 9.5rem;
  }
}
</style>
