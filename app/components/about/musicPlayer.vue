<script setup lang="ts">
onMounted(() => {
  if (!import.meta.client)
    return

  ;(window as any).NeteaseMiniPlayer?.init?.()
})
</script>

<template>
  <div class="author-content-item music-player">
    <div class="music-player-inner">
      <div
        class="netease-mini-player"
        data-playlist-id="13681647281"
        data-theme="auto"
        data-position="static"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.author-content-item.music-player {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: visible;
  z-index: 5;
}

.music-player-inner {
  display: flex;
  justify-content: center;
}

:deep(.netease-mini-player) {
  position: relative !important;
  bottom: auto !important;
  right: auto !important;
  margin: 0 auto;
}
</style>
