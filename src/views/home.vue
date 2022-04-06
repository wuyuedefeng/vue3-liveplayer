<template>
  <div class="live-player" :style="playStyle">
    <component :is="componentVersion"></component>
  </div>
</template>

<script>
import { reactive, toRefs, defineComponent, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    LivePlayerV1: defineAsyncComponent(() => import('@/components/LivePlayerV1')),
    LivePlayerV2: defineAsyncComponent(() => import('@/components/LivePlayerV2')),
    LivePlayerV3: defineAsyncComponent(() => import('@/components/LivePlayerV3')),
    LivePlayerV4: defineAsyncComponent(() => import('@/components/LivePlayerV4')),
  },
  setup (props, ctx) {
    const route = useRoute()
    const { width = '600px', height = '400px', componentVersion = 'LivePlayerV1' } = route.query
    const state = reactive({
      playStyle: { width, height },
      componentVersion,
    })
    return { ...toRefs(state) }
  },
})
</script>
