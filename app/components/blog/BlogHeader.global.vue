<script setup lang="ts">
const blogConfig = useAppConfig()

const appConfig = useAppConfig()
const { author } = appConfig
const { name, avatar } = author
const isHovered = ref(false)
const router = useRouter()

function navigateToArticles() {
	router.push('/')
}
</script>

<template>
<div
	class="zhilu-header"
	@mouseenter="isHovered = true"
	@mouseleave="isHovered = false"
	@click="navigateToArticles"
>
	<!-- 动态粒子背景 -->
	<div class="particle" />
	<div class="particle" />
	<div class="particle" />
	<div class="particle" />

	<div class="header-content">
		<div class="avatar-container">
			<img :src="avatar" alt="Avatar" class="avatar">
		</div>
		<div class="text-container">
			<h2 class="name">
				{{ name }}
				<span class="developer-tag">
					<transition name="fade" mode="out-in">
						<span v-if="!isHovered" key="default"><{{ blogConfig.headerConfig.defaultTag }}/></span>
						<span v-else key="hovered" class="moyu"><{{ blogConfig.headerConfig.hoverTag }}/></span>
					</transition>
				</span>
			</h2>
			<p class="tagline">
				<transition name="fade" mode="out-in">
					<span v-if="!isHovered" key="default">{{ blogConfig.subtitle }}</span>
					<span v-else key="hovered" class="love">{{ blogConfig.headerConfig.hoverSubtitle }}</span>
				</transition>
			</p>
		</div>
	</div>
</div>
</template>

<style scoped>
.zhilu-header {
  position: relative;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg-card) 100%);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--c-border);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: gentleBackgroundShift 20s ease-in-out infinite;
  will-change: transform, box-shadow, background;
  transform: translateZ(0);
}

@keyframes gentleBackgroundShift {
  0%, 100% {
    background: linear-gradient(135deg,
      var(--c-bg-soft) 0%,
      var(--c-bg-card) 100%);
  }
  25% {
    background: linear-gradient(135deg,
      var(--c-bg-soft) 0%,
      rgba(44, 142, 221, 0.08) 40%,
      var(--c-bg-card) 100%);
  }
  50% {
    background: linear-gradient(135deg,
      var(--c-bg-soft) 0%,
      rgba(44, 142, 221, 0.12) 50%,
      var(--c-bg-card) 100%);
  }
  75% {
    background: linear-gradient(135deg,
      var(--c-bg-soft) 0%,
      rgba(44, 142, 221, 0.06) 60%,
      var(--c-bg-card) 100%);
  }
}

/* 增强的动态粒子背景 - 始终显示 */
.zhilu-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(44, 142, 221, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(44, 142, 221, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 40% 80%, rgba(44, 142, 221, 0.1) 0%, transparent 60%);
  opacity: 0.8; /* 增强背景可见度 */
  transition: opacity 0.4s ease;
  z-index: 0;
}

.zhilu-header:hover::after {
  opacity: 1;
}

/* Apple风格的动态光点动画 */
@keyframes floatParticles {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 0.2;
  }
  25% {
    transform: translate(12px, -10px) scale(1.15) rotate(90deg);
    opacity: 0.4;
  }
  50% {
    transform: translate(-15px, 8px) scale(0.85) rotate(180deg);
    opacity: 0.3;
  }
  75% {
    transform: translate(8px, 15px) scale(1.1) rotate(270deg);
    opacity: 0.5;
  }
}

/* 增强的粒子动画效果 */
@keyframes floatParticles {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(30px, -25px) scale(1.5);
    opacity: 1;
  }
  50% {
    transform: translate(-25px, 20px) scale(0.7);
    opacity: 0.7;
  }
  75% {
    transform: translate(25px, 30px) scale(1.4);
    opacity: 1;
  }
}

/* 增强的粒子效果 - 更加明显 */
.zhilu-header .particle {
  position: absolute;
  background: linear-gradient(45deg,
    rgba(44, 142, 221, 0.3),
    rgba(44, 142, 221, 0.15));
  border-radius: 50%;
  animation: floatParticles 10s ease-in-out infinite;
  z-index: 0;
  filter: blur(1px);
  box-shadow: 0 0 12px rgba(44, 142, 221, 0.2);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.zhilu-header:hover .particle {
  animation-duration: 6s;
  filter: blur(1.5px);
  box-shadow: 0 0 16px rgba(44, 142, 221, 0.3);
}

.zhilu-header .particle:nth-child(1) {
  width: 10px;
  height: 10px;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
  background: linear-gradient(45deg,
    rgba(44, 142, 221, 0.4),
    rgba(44, 142, 221, 0.25));
}

.zhilu-header .particle:nth-child(2) {
  width: 4px;
  height: 4px;
  top: 65%;
  left: 75%;
  animation-delay: 3s;
  background: linear-gradient(135deg,
    rgba(44, 142, 221, 0.2),
    rgba(44, 142, 221, 0.1));
}

.zhilu-header .particle:nth-child(3) {
  width: 12px;
  height: 12px;
  top: 40%;
  left: 60%;
  animation-delay: 4s;
  background: linear-gradient(225deg,
    rgba(44, 142, 221, 0.45),
    rgba(44, 142, 221, 0.3));
}

.zhilu-header .particle:nth-child(4) {
  width: 10px;
  height: 10px;
  top: 55%;
  left: 35%;
  animation-delay: 6s;
  background: linear-gradient(315deg,
    rgba(44, 142, 221, 0.4),
    rgba(44, 142, 221, 0.25));
}

.zhilu-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--c-border);
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1rem; /* 减小头像和文字的距离 */
}

.avatar-container {
  flex-shrink: 0;
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid var(--c-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.zhilu-header:hover .avatar-container {
  transform: scale(1.08);
  border-color: var(--c-primary);
  box-shadow: 0 6px 16px rgba(44, 142, 221, 0.2);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-container {
  flex-grow: 1;
  overflow: visible;
  min-width: 0;
}

.name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: var(--c-text-1);
  white-space: nowrap;
  overflow: visible;
  transition: color 0.3s ease;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.zhilu-header:hover .name {
  color: var(--c-primary);
}

.tagline {
  font-size: 0.875rem;
  color: var(--c-text-2);
  margin: 0.5rem 0 0;
  opacity: 0.9;
  transition: all 0.3s ease;
  line-height: 1.4;
}

.zhilu-header:hover .tagline {
  opacity: 1;
  color: var(--c-text-1);
}

.moyu {
  color: #c79f2c;
  font-weight: 600;
}

.love {
  color: #fa6b81;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.developer-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-primary);
  background: rgba(44, 142, 221, 0.15);
  padding: 0rem 0.1rem;
  border-radius: 20px;
  margin-left: 0rem;
  margin-right: 0rem;
  vertical-align: middle;
  transition: all 0.3s ease;
  border: none; /* 移除边框 */
  font-family: 'Inter', 'PingFang SC', sans-serif;
  display: inline-block;
  line-height: 1.2;
}

.zhilu-header:hover .developer-tag {
  background: rgba(44, 142, 221, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgba(44, 142, 221, 0.25);
}

@media (max-width: 768px) {
  .zhilu-header {
    padding: 1.25rem;
    margin: 0.75rem 0;
  }

  .avatar-container {
    width: 3.5rem;
    height: 3.5rem;
  }

  .name {
    font-size: 1.25rem;
  }

  .tagline {
    font-size: 0.8rem;
  }

  .developer-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .zhilu-header {
    padding: 1rem;
    animation: none; /* 在移动设备上禁用背景动画以节省性能 */
  }

  .header-content {
    gap: 1rem;
  }

  .avatar-container {
    width: 3rem;
    height: 3rem;
  }

  .name {
    font-size: 1.1rem;
  }

  .tagline {
    font-size: 0.75rem;
  }

  /* 在移动设备上简化粒子效果 */
  .zhilu-header .particle {
    animation-duration: 16s;
    opacity: 0.1;
  }

  .zhilu-header:hover .particle {
    animation-duration: 12s;
  }
}

/* 针对低性能设备的优化 */
@media (prefers-reduced-motion: reduce) {
  .zhilu-header {
    animation: none;
  }

  .zhilu-header .particle {
    animation: none;
    opacity: 0.05;
  }

  .zhilu-header::before,
  .zhilu-header::after {
    transition: none;
    animation: none;
  }
}
</style>
