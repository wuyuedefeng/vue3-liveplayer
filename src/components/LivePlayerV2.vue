<template>
  <div ref="playerRef" class="player" id="player"></div>
</template>

<script>
import { reactive, toRefs, defineComponent, onMounted, markRaw } from 'vue'
import { parseM3u8Url } from '@/utils/libs/m3u8Util'
import { loadScript } from '@/utils/libs/resourceLoader'
import { useRoute } from 'vue-router'

const skdLoaderPromise = new Promise(async resolve => {
  await loadScript('/easyWasmPlayer/EasyWasmPlayer.js')
  resolve()
})

export default defineComponent({
  setup (props, ctx) {
    const route = useRoute()
    const { version, url, width, height, ...videoAttrs } = route.query

    let player = null

    const state = reactive({
      isInitFinished: false,
      playerRef: null,
      //https://github.com/tsingsee/EasyPlayer.js#%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7
      videoAttrs: {
        'video-url': url,
        ...videoAttrs,
      },
    })

    onMounted(async () => {
      await skdLoaderPromise
      await parseM3u8Url(state.videoAttrs['video-url']).then(playlistUrl => {
        state.videoAttrs['video-url'] = playlistUrl
      })
      state.isInitFinished = true
      state.player = new WasmPlayer(null, 'player', (e) => {
        console.log('callbackfun', e)
      })
      // 调用播放
      state.player.play(state.videoAttrs['video-url'], 1)
    })

    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.player {
  width: 100%;
  height: 100%;

  ::v-deep(.iconqingxiLOGO) {
    display: none;
  }
}
</style>