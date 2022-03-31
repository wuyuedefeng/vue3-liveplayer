<template>
  <div ref="playerRef" class="player"></div>
</template>

<script>
import { reactive, toRefs, defineComponent, onMounted, onUnmounted } from 'vue'
import { parseM3u8Url } from '@/utils/libs/m3u8Util'
import { loadScript } from '@/utils/libs/resourceLoader'
import { useRoute } from 'vue-router'
import Player from 'goldvideo-player'
import 'goldvideo-player/dist/goldplay-h265.css'

export default defineComponent({
  setup (props, ctx) {
    const route = useRoute()
    const { version, url, width, height, ...videoAttrs } = route.query
    let player = null

    const state = reactive({
      isInitFinished: false,
      playerRef: null,
      //https://github.com/goldvideo/example/blob/master/greenplayer/src/GreenPlayer.js
      videoOptions: {
        controlBarAutoHide: true,
        controlBarAutoHideTime: 20,
        needInit: true,
        playBackRate: 1,
        sourceURL: 'https://zsvideo.hesc.com.cn:30031/streamDelivery_ZS01_80/playlist/befb45a1dcbd80a83306e9ac46d9974a.m3u8',
        type: 'HLS',
        ...videoAttrs,
        libPath: `${location.origin}/h265player/lib/`
      },
    })

    onMounted(() => {
      player = new Player(state.playerRef, state.videoOptions)
    })

    onUnmounted(() => {
      player.destroy()
    })

    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.player {
  width: 100%;
  height: 100%;
}
</style>