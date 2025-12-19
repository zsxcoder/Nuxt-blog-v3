<template>
  <div class="particles-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 定义粒子类
class Particle {
  constructor(canvas, colors) {
    this.canvas = canvas;
    this.colors = colors;
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * this.canvas.width;
    this.y = initial ? Math.random() * this.canvas.height : this.canvas.height + 20;
    this.size = Math.random() * 5 + 3;
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.speedY = Math.random() * -1.0 - 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.fadeSpeed = Math.random() * 0.01 + 0.005;
    this.type = Math.random() > 0.7 ? 'star' : 'circle';
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === 'star') {
      ctx.rotate(this.rotation);
      ctx.beginPath();
      const r = this.size * 2;
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0.5, -0.5, r, 0);
      ctx.quadraticCurveTo(0.5, 0.5, 0, r);
      ctx.quadraticCurveTo(-0.5, 0.5, -r, 0);
      ctx.quadraticCurveTo(-0.5, -0.5, 0, -r);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y < this.canvas.height * 0.2) {
      this.opacity -= this.fadeSpeed;
    } else if (this.opacity < 1) {
      this.opacity += this.fadeSpeed;
    }

    if (this.y < -20 || this.opacity <= 0) {
      this.reset();
    }
  }
}

const canvasRef = ref(null);
let animationFrameId;
let particles = [];

const getColors = (isDark) => {
  if (isDark) return [
    'rgba(211, 188, 142, 0.6)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(66, 133, 244, 0.4)',
    'rgba(252, 211, 77, 0.4)',
  ];
  return [
    'rgba(180, 83, 9, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(148, 163, 184, 0.4)'
  ];
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  console.log('Initializing particle background');

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const isDark = document.documentElement.classList.contains('dark');
  let colors = getColors(isDark);
  const particleCount = 50;

  // 创建粒子
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas, colors));
  }

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    animationFrameId = requestAnimationFrame(animate);
  };

  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const newIsDark = document.documentElement.classList.contains('dark');
        if (newIsDark !== isDark) {
          colors = getColors(newIsDark);
          particles.forEach(particle => {
            particle.colors = colors;
            particle.color = colors[Math.floor(Math.random() * colors.length)];
          });
        }
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  // 初始化和启动动画
  resizeCanvas();
  animate();

  // 响应窗口大小变化
  window.addEventListener('resize', resizeCanvas);

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);
    cancelAnimationFrame(animationFrameId);
    observer.disconnect();
    console.log('Particle background cleaned up');
  });
});
</script>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>