<template>
  <div>
    <a-layout id="layout-default" class="layout-default" :class="[layoutClass]">
      <!-- <DefaultHeader></DefaultHeader> -->
      <a-layout-content>
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <h1>Loading...</h1>
          </template>
        </Suspense>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DefaultHeader from '../components/headers/defaultHeader.vue'
@Options({
  components: {
    DefaultHeader,
  },
})
/** Default */
export default class Default extends Vue {
  /**
   * 描述
   * @date 2022-01-06
   * @return {any}
   */
  layoutClass() {
    return this.$route.meta.layoutClass
  }
}
</script>
