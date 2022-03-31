<template>
  <router-view></router-view>
</template>

<script>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  setup (props, ctx) {
    const state = reactive({})
    return { ...toRefs(state) }
  },
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>