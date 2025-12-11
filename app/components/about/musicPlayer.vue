<script setup lang="ts">
import { about } from '../../about'

// 音乐播放器配置
const musicConfig = {
	server: about[0]?.music[0]?.server || 'netease',
	type: about[0]?.music[0]?.type || 'playlist',
	id: about[0]?.music[0]?.id || '13681647281',
	theme: 'var(--c-primary, #667eea)',

	loop: 'all',
	order: 'list',
	preload: 'auto',
	volume: 0.7,
	mutex: true,
	listFolded: true,
	listMaxHeight: '340px',
	autoplay: false,
}

onMounted(() => {
	if (process.client) {
		// 确保脚本只加载一次
		if (!document.querySelector('script[src*="APlayer.min.js"]')) {
			const aPlayerCss = document.createElement('link')
			aPlayerCss.rel = 'stylesheet'
			aPlayerCss.href = '/css/APlayer.min.css'
			document.head.appendChild(aPlayerCss)

			const aPlayerScript = document.createElement('script')
			aPlayerScript.src = '/js/APlayer.min.js'
			document.head.appendChild(aPlayerScript)

			const metingScript = document.createElement('script')
			metingScript.src = '/js/Meting.min.js'
			document.head.appendChild(metingScript)

			// 等待脚本加载完成后初始化
			aPlayerScript.onload = () => {
				console.log('APlayer 脚本加载完成')
			}

			metingScript.onload = () => {
				console.log('MetingJS 脚本加载完成')
			}
		}
	}
})
</script>

<template>
<div v-for="(musicItem, index) in about" :key="index" class="author-content-item music-player">
	<div class="author-content-item-tips">
		音乐收藏
	</div>
	<div class="music-title">
		我的网易云播放列表
	</div>
	<div class="music-container">
		<meting-js
			:id="musicConfig.id"
			:server="musicConfig.server"
			:type="musicConfig.type"
			:theme="musicConfig.theme"
			:loop="musicConfig.loop"
			:order="musicConfig.order"
			:preload="musicConfig.preload"
			:volume="musicConfig.volume"
			:mutex="musicConfig.mutex"
			:list-folded="musicConfig.listFolded"
			:list-max-height="musicConfig.listMaxHeight"
			:autoplay="musicConfig.autoplay"
		/>
	</div>
</div>
</template>

<style lang="scss" scoped>
.author-content-item {
  &.music-player {
    width: 100%;
    padding: 1.5rem;
    background: var(--c-bg-1);
    border: 1px solid var(--c-border);
    border-radius: 12px;
    box-shadow: var(--heo-shadow-border);
  }

  .author-content-item-tips {
    opacity: 0.8;
    font-size: 12px;
    margin-bottom: 0.5rem;
    color: var(--c-text-2);
  }

  .music-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--c-text-1);
  }
}

.music-container {
  border-radius: 8px;
  overflow: hidden;
  min-height: 120px;

  /* MetingJS 播放器样式调整 */
  :deep(.aplayer) {
    margin: 0;
    background: transparent;
    box-shadow: none;

    /* 移除可能的白色边框和背景 */
    &::before, &::after {
      display: none;
    }

    .aplayer-body {
      background: transparent;
    }

    /* 移除分隔线 */
    .aplayer-pic {
      border: none;
      background-color: transparent;
    }

    .aplayer-info {
      border: none;
      background: var(--c-bg-soft);

      .aplayer-music {
        color: var(--c-text-1);

        .aplayer-title {
          color: var(--c-text-1);
        }

        .aplayer-author {
          color: var(--c-text-2);
        }
      }

      .aplayer-controller {
        .aplayer-time {
          color: var(--c-text-2);
        }

        .aplayer-bar {
          background: var(--c-bg-2);
          border: none;

          .aplayer-loaded {
            background: var(--c-bg-3);
          }

          .aplayer-played {
            background: var(--c-primary, #667eea);
            border: none;

            .aplayer-thumb {
              background: var(--c-primary, #667eea);
            }
          }
        }

        .aplayer-icon {
          color: var(--c-text-2);

          &:hover {
            color: var(--c-primary, #667eea);
          }
        }
      }
    }

    .aplayer-list {
      background: transparent;
      border: none;

      color: var(--c-text-1);

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: var(--c-bg-2);
      }

      &::-webkit-scrollbar-thumb {
        background: var(--c-primary, #667eea);
        border-radius: 3px;
      }

      li {
        border-color: var(--c-border);
        border-bottom: 1px solid var(--c-border);

        &:hover {
          background: var(--c-bg-1);
        }

        &.aplayer-list-light {
          background: var(--c-bg-2);

          .aplayer-list-index, .aplayer-list-title, .aplayer-list-author {
            color: var(--c-primary, #667eea);
          }
        }

        /* 移除播放器列表项中的分隔线 */
        &:not(:last-child) {
          border-bottom: 1px solid var(--c-border);
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    /* 歌词区域样式：去掉白色边框，提升可读性 */
    .aplayer-lrc {
      border: none !important;
      background: transparent !important;
      color: var(--c-text-2);

      /* 移除歌词区域的白色渐变背景 */
      &::before, &::after {
        display: none !important;
        background: transparent !important;
      }
    }

    .aplayer-lrc p {
      color: var(--c-text-2);
    }

    .aplayer-lrc p.aplayer-lrc-current {
      color: var(--c-primary, #667eea);
      font-weight: 600;
    }

    /* 确保图标和按钮的背景透明 */
    .aplayer-icon {
      background: transparent;
    }

  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .music-container {
    :deep(.aplayer) {
      .aplayer-list {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
