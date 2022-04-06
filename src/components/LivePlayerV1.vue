<template>
  <easy-player v-if="isInitFinished" ref="playerRef" class="player" v-bind="videoAttrs"></easy-player>
  <!--<button v-if="isInitFinished" @click="destroyVideoPlayer">销毁播放器</button>-->
</template>

<script>
import { reactive, toRefs, defineComponent, onMounted, onUnmounted, nextTick } from 'vue'
import { parseM3u8Url } from '@/utils/libs/m3u8Util'
import { loadScript } from '@/utils/libs/resourceLoader'
import { useRoute } from 'vue-router'

const skdLoaderPromise = new Promise(async resolve => {
  await loadScript('/easyPlayer/EasyPlayer-element.min.js')
  resolve()
})

export default defineComponent({
  setup (props, ctx) {
    const route = useRoute()
    const { version, url, width, height, ...videoAttrs } = route.query
    const state = reactive({
      isInitFinished: false,
      playerRef: null,
      //https://github.com/tsingsee/EasyPlayer.js#%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7
      videoAttrs: {
        debug: 'false',
        muted: 'true',
        live: 'true',
        'auto-play': 'true',
        //aspect: '5:3',
        'easy-stretch': 'false',
        'video-url': url,
        //resolution: 'yh,fhd,hd,sd',
        ...videoAttrs,
      },
      destroyVideoPlayer() {
        if (state.playerRef?.getVueInstance) {
          state.playerRef.getVueInstance().destroyPlayer()
        }
      }
    })

    onMounted(async () => {
      await skdLoaderPromise
      await parseM3u8Url(state.videoAttrs['video-url']).then(playlistUrl => {
        state.videoAttrs['video-url'] = playlistUrl
      })
      state.isInitFinished = true

      nextTick(() => {
        const img = state.playerRef.querySelector('.easy-player-loading img')
        if (img) { img.style = 'display: none' }
        //console.log('instance', state.playerRef.getVueInstance())
        const reloadStream = (type) => {
          if (type === 'ended') return state.playerRef.getVueInstance()?.replay()
          state.playerRef.getVueInstance()?.initPlayer()
        }

        //视频加载异常时 重新初始化播放器
        state.playerRef.addEventListener('error', () => {
          console.info('error')
          reloadStream()
        })
        state.playerRef.addEventListener('message', () => {
          console.info('message')
          reloadStream()
        })
        state.playerRef.addEventListener('ended', () => {
          console.info('ended')
          reloadStream('ended')
        })
      })
    })

    onUnmounted(() => {
      state.destroyVideoPlayer()
    })

    return { ...toRefs(state) }
  },
})
</script>

<style scoped>
.player {
  ::v-deep('.easy-player-loading logo') {
    display: none;
  }
}
</style>