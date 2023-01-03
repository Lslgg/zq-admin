<template>
  <a-config-provider :locale="locale">
    <component :is="layout" :class="urlName">
      <router-view />
    </component>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { useFavicon } from '@vueuse/core'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { UseCommon } from './util/useCommon'
import { GlobalStore } from './util/globalStore'
dayjs.locale('zh-cn')
/** app */
export default class App extends Vue {
  /** mounted */
  async mounted() {
    try {
      if (window.location.pathname === '/admin/login') return
      await UseCommon.ins().getSiteInfo()
      const site = UseCommon.ins().siteInfo
      GlobalStore.ins().setSiteInfo$(site)
      if (site?.icon?.url) useFavicon(site.icon.url)
    } catch (error) {
      window.location.href = '/admin/login'
    }
  }
  /** 布局 */
  get layout() {
    const layoutName = this.$route.meta.layout ?? 'default'
    return `layout-${(layoutName as string).toLowerCase()}`
  }
  /** 默认类名 */
  get urlName() {
    return this.$route.name
  }
  locale = zhCN
}
</script>

<style lang="scss" scoped>
</style>
