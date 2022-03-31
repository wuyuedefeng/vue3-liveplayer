<template>
  <video ref="videoRef" class="hls-player" v-bind="computedVideoOptions"></video>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed, onMounted, onUnmounted, watch } from 'vue'
//https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlsrecovermediaerror
import Hls from 'hls.js'

export default defineComponent({
  props: {
    hlsOptions: [Object],
    videoOptions: [Object],
    hlsSize: [Object],
    src: [String, Object]
  },
  emits: ['update:hlsSize'],
  setup (props, ctx) {
    const hls = new Hls({
      debug: import.meta.env.NODE_ENV === 'development',
      //enableWorker: true,
      //lowLatencyMode: true,
      //backBufferLength: 90,
      ...props.hlsOptions
    })

    const state = reactive({
      videoRef: null,
      currentHlsSize: computed({
        get() {
          return props.hlsSize
        },
        set(nv) {
          ctx.emit('update:hlsSize', nv)
        }
      }),
      computedVideoOptions: computed(() => {
        return {
          muted: true,
          playsinline: 'playsinline',
          'webkit-playsinline': true,
          controls: true,
          autoplay: true,
          ...props.videoOptions,
        }
      })
    })

    //hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //  state.autoplay && state.videoRef?.play()
    //})
    hls.on(Hls.Events.ERROR, function (event, data) {
      console.error(event, data)
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // try to recover network error
            console.log('fatal network error encountered, try to recover');
           hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('fatal media error encountered, try to recover');
            hls.recoverMediaError()
            break;
          default:
            // cannot recover
            hls.destroy()
            break
        }
      }
    })

    onMounted(() => {
      state.videoRef.ontimeupdate = () => {
        const size = { videoWidth: state.videoRef?.videoWidth, videoHeight: state.videoRef?.videoHeight }
        if (state.currentHlsSize?.videoWidth !== size.videoWidth || state.currentHlsSize?.videoHeight !== size.videoHeight) {
          state.currentHlsSize = size
        }
      }

      hls.attachMedia(state.videoRef)
      watch(() => props.src, nv => {
        if (nv) {
          hls.loadSource(nv)
        } else {
          state.videoRef?.stop && state.videoRef?.stop()
        }
      }, {immediate: true});
    })

    onUnmounted(() => {
      hls.destroy()
    })

    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.hls-player {
  width: 100%;
  height: 100%;
}
</style>