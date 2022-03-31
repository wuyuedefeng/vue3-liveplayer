<template>
  <HlsPlayer ref="videoRef" :src="videoUrl" controls/>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'
// https://github.com/ffmpegwasm/vue-app/blob/main/src/App.vue
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { useRoute } from 'vue-router'
import HlsPlayer from './HlsPlayer'

export default defineComponent({
  components: {
    HlsPlayer
  },
  setup (props, ctx) {
    const route = useRoute()
    const { version, url, ...videoAttrs } = route.query

    const ffmpeg = createFFmpeg({
      log: true,
    })

    const state = reactive({
      videoRef: null,
      videoUrl: '',
      async transcode() {
        await ffmpeg.load()
        ffmpeg.run('-i', url, '-vcodec', 'libx264', '-acodec', 'copy', '-f' ,'hls', '-hls_list_size', '3', '-hls_wrap', '5', 'playlist.m3u8' )
        const data = ffmpeg.FS('readFile', 'playlist.m3u8')
        state.videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'application/x-mpegURL' }))

        //await ffmpeg.run(`-listen 1 -i ${url}`)
      }
    })
    state.transcode()
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>