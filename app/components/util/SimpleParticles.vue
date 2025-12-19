<template>
  <div class="particles" ref="particlesRef"></div>
</template>

<script setup>
const particlesRef = ref(null);

onMounted(() => {
  if (!particlesRef.value) return;
  
  // 创建多个粒子元素
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机大小
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 随机位置
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // 随机动画延迟
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    // 随机动画持续时间
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    
    particlesRef.value.appendChild(particle);
  }
});
</script>

<style scoped>
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}
</style>