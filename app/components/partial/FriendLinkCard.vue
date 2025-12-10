<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

// 动态接收友链数据
const props = defineProps({
	siteName: {
		type: String,
		default: '示例站点',
	},
	sitenick: {
		type: String,
		default: '友情链接',
	},
	siteUrl: {
		type: String,
		default: 'https://example.com',
	},
	siteDesc: {
		type: String,
		default: '这是一个示例友链站点',
	},
	siteIcon: {
		type: String,
		default: '',
	},
	upstream: {
		type: Boolean,
		default: false,
	},
	date: {
		type: String,
		default: '',
	},
	qrcode: {
		type: String,
		default: '',
	},
	recommend: {
		type: Boolean,
		default: false,
	},
})

// 控制二维码模态框显示
const showQrcodeModal = ref(false)

// 跳转到友链网站
function navigateToSite() {
	if (props.siteUrl) {
		window.open(props.siteUrl, '_blank')
	}
}
</script>

<template>
<div class="friend-link-card">
	<!-- 卡片内部孔洞效果 -->
	<div class="card-punch-hole" />

	<!-- 卡片标题：友链展示 -->
	<div class="friend-link-card__title">
		{{ sitenick }}
	</div>

	<!-- 友链核心信息 -->
	<div class="friend-link-card__info-list">
		<div class="info-header">
			<div class="author-info">
				<span class="author-name">{{ siteName }}</span>
			</div>
			<div class="description-info">
				{{ siteDesc }}
			</div>
		</div>
	</div>

	<!-- 站点图标（可选） -->
	<div v-if="siteIcon" class="friend-link-card__icon">
		<img
			:src="siteIcon"
			:alt="`${siteName} icon`"
			class="site-icon"
		>
	</div>

	<!-- 右下角日期显示 -->
	<div v-if="date" class="date-display">
		{{ date }}
	</div>

	<!-- 右下角upstream图片 -->
	<div v-if="upstream" class="upstream-image">
		<img
			src="https://cdn.atao.cyou/Web/upstream.png"
			alt="upstream"
			class="upstream-img"
		>
	</div>

	<!-- 右下角recommend图片 -->
	<div v-if="recommend" class="recommend-image">
		<img
			src="https://cdn.atao.cyou/Web/recommend.png"
			alt="recommend"
			class="recommend-img"
		>
	</div>

	<!-- 左下角二维码图片 -->
	<div v-if="qrcode" class="qrcode-image" @click="showQrcodeModal = true">
		<img
			:src="qrcode"
			alt="二维码"
			class="qrcode-img"
		>
	</div>

	<!-- 底部跳转指示器 -->
	<div
		class="link-indicator"
		@click="navigateToSite"
	>
		<span class="indicator-text">前往网站</span>
		<span class="indicator-arrow">→</span>
	</div>

	<!-- 二维码模态框 - 使用Teleport确保模态框在body层级 -->
	<Teleport to="body">
		<div v-if="showQrcodeModal" class="qrcode-modal" @click.self="showQrcodeModal = false">
			<div class="modal-content">
				<img
					:src="qrcode"
					alt="放大二维码"
					class="modal-qrcode"
				>
				<button class="modal-close" @click="showQrcodeModal = false">
					×
				</button>
			</div>
		</div>
	</Teleport>
</div>
</template>

<style scoped>
/* 自定义字体定义 */
@font-face {
  font-family: 'ChillHuoSong_F';
  src: url('/fonts/AlimamaFangYuanTi.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* 卡片容器基础样式 - 参考ModernTicketCard风格 */
.friend-link-card {
  width: 320px;
  height: 210px; /* 固定卡片高度 */
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Arial', sans-serif;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden; /* 确保内容不会溢出 */
}

/* 卡片标题样式 */
.friend-link-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #2a2a2a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: default;
  user-select: none;
  font-family: 'ChillHuoSong_F', serif; /* 使用自定义字体 */
}

/* 信息列表容器 */
.friend-link-card__info-list {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 缩短行间距 */
}

/* 单个信息项 */
.info-item {
  display: flex;
  align-items: center; /* 改为居中对齐 */
  min-height: 24px;
}

/* 简约信息头部样式 */
.info-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  font-family: 'ChillHuoSong_F', serif;
  cursor: default;
}

.description-info {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.4;
  font-weight: 400;
  cursor: default;
  /* 限制最多显示2行，超出的内容以省略号显示 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 暗色模式 */
html.dark .friend-link-card .author-name {
  color: var(--c-text-1) !important;
}

html.dark .friend-link-card .description-info {
  color: var(--c-text-2) !important;
}

/* 真实穿孔效果 - 带阴影的透明孔洞 */
.card-punch-hole {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px; /* 缩小孔洞尺寸 */
  height: 16px;
  border-radius: 50%;
  background: transparent;
  border: none;
  z-index: 5;
  /* 模拟纸张穿孔的真实阴影效果 */
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 -1px 1px rgba(255, 255, 255, 0.1);
  /* 确保孔洞区域可以点击穿透 */
  pointer-events: none;
}

/* 深色模式适配  */
html.dark .friend-link-card .card-punch-hole {
  background: transparent !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 3px rgba(0, 0, 0, 0.6),
    inset 0 -1px 1px rgba(0, 0, 0, 0.2) !important;
}

/* 站点图标样式 */
.friend-link-card__icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.site-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

/* 卡片hover交互 */
.friend-link-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 卡片hover时博主和描述文字效果 */
/* .friend-link-card:hover .author-name { */
  /* font-weight: 700; */
  /* text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); */
/* } */

/* .friend-link-card:hover .description-info { */
  /* font-weight: 500; */
  /* text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15); */
  /* position: relative; */
/* } */

.friend-link-card:hover .description-info::after {
  content: '|';
  animation: blink 1s infinite;
  color: #3b82f6;
  font-weight: 500;
  margin-left: 2px;
  font-size: 14px;
  cursor: default;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 暗色模式支持 */
html.dark .friend-link-card {
  background-color: var(--c-bg-2) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

html.dark .friend-link-card .friend-link-card__title {
  color: var(--c-text) !important;
  border-bottom-color: var(--c-border) !important;
}

html.dark .friend-link-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
}

/* upstream图片样式 */
.upstream-image {
  position: absolute;
  top: 110px;
  right: 18px;
  width: 60px; /* 稍微缩小尺寸 */
  height: 60px;
  z-index: 10;
  transition: all 0.3s ease;
  transform: rotate(-10deg);
}

.upstream-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* 悬停效果 */
.upstream-image:hover {
  transform: rotate(-15deg) scale(1.05);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}

/* recommend图片样式 - 与upstream保持一致 */
.recommend-image {
  position: absolute;
  top: 110px; /* 与upstream相同位置 */
  right: 18px;
  width: 60px; /* 与upstream相同尺寸 */
  height: 60px;
  z-index: 10;
  transition: all 0.3s ease;
  transform: rotate(-10deg); /* 与upstream相同旋转角度 */
}

.recommend-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* 悬停效果 - 与upstream保持一致 */
.recommend-image:hover {
  transform: rotate(-15deg) scale(1.05);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}

/* 日期显示样式 */
.date-display {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 11px;
  color: #666666;
  font-family: 'Courier New', monospace;
  cursor: default;
  user-select: none;
  opacity: 0.8;
}

/* 暗色模式日期显示 */
html.dark .friend-link-card .date-display {
  color: var(--c-text-3) !important;
}

/* 暗色模式二维码 */
html.dark .friend-link-card .qrcode-img {
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1)) !important;
}

html.dark .friend-link-card .qrcode-image:hover .qrcode-img {
  filter: drop-shadow(0 3px 8px rgba(255, 255, 255, 0.15)) !important;
}

/* 二维码图片样式 */
.qrcode-image {
  position: absolute;
  bottom: 15px;
  left: 15px;
  width: 50px;
  height: 50px;
  z-index: 10;
  transition: all 0.3s ease;
}

.qrcode-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* 悬停效果 */
.qrcode-image:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}

/* 响应式调整 */
@media (max-width: 480px) {
  .upstream-image {
    width: 50px;
    height: 50px;
    top: 50px; /* 移动端也调整到上方位置 */
    right: 12px;
  }

  .date-display {
    font-size: 10px;
    bottom: 12px;
    right: 12px;
  }

  .qrcode-image {
    width: 40px;
    height: 40px;
    bottom: 12px;
    left: 12px;
  }

  .recommend-image {
    width: 50px;
    height: 50px;
    top: 150px;
    right: 12px;
  }
}

/* 底部跳转指示器样式 - 简约现代风格 */
.link-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  height: 18px;
  background: rgba(100, 116, 139, 0.7);
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.12s ease;
  border-radius: 6px;
  font-weight: 300;
  z-index: 20;
  padding: 0 8px;
  min-width: 50px;
  font-size: 10px;
  letter-spacing: 0.1px;
}

.link-indicator:hover {
  background: rgba(71, 85, 105, 0.8);
  transform: translateX(-50%) translateY(0);
}

.indicator-text {
  font-size: 10px;
}

.indicator-arrow {
  font-size: 10px;
  transition: transform 0.12s ease;
}

.link-indicator:hover .indicator-arrow {
  transform: translateX(0.3px);
}

/* 卡片hover时显示指示器 */
.friend-link-card:hover .link-indicator {
  opacity: 0.8;
  transform: translateX(-50%) translateY(0);
}

/* 暗色模式指示器 */
html.dark .friend-link-card .link-indicator {
  background: rgba(148, 163, 184, 0.7) !important;
  color: #0f172a !important;
}

html.dark .friend-link-card .link-indicator:hover {
  background: rgba(100, 116, 139, 0.8) !important;
}

/* 二维码模态框样式 */
.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-qrcode {
  width: 280px;
  height: 280px;
  object-fit: contain;
  display: block;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

/* 暗色模式模态框 */
html.dark .friend-link-card .modal-content {
  background: var(--c-bg-3) !important;
}

html.dark .friend-link-card .modal-close {
  background: var(--c-bg-2) !important;
  color: var(--c-text) !important;
}

html.dark .friend-link-card .modal-close:hover {
  background: var(--c-bg-1) !important;
}
</style>
