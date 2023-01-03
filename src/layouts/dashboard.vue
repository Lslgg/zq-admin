<template>
  <div>
    <a-layout id="layout-dashboard" class="layout-dashboard" :class="[
      navbarFixed ? 'navbar-fixed' : '',
      !sidebarCollapsed ? 'has-sidebar' : '',
      layoutClass,
      sidebarMinimized ? 'sidebar-minimized' : '',
    ]">
      <DashboardSidebar v-model:minized="sidebarMinimized" :sidebar-collapsed="sidebarCollapsed"
        :sidebar-color="sidebarColor" :sidebar-theme="sidebarTheme" @toggleSidebar="toggleSidebar"></DashboardSidebar>
      <a-layout>
        <DashboardHeader :sidebar-collapsed="sidebarCollapsed" :navbar-fixed="navbarFixed"
          @toggleSettingsDrawer="toggleSettingsDrawer" @toggleSidebar="toggleSidebar"
          @minimizeSidebar="minimizeSidebar"></DashboardHeader>
        <a-layout-content>
          <Suspense :key="$route.fullPath">
            <template #default>
              <router-view :navbar-fixed="navbarFixed" />
            </template>
            <template #fallback>
              <a-spin :spinning="true" wrapperClassName="w-full h-full border"></a-spin>
            </template>
          </Suspense>
        </a-layout-content>
        <div v-show="!sidebarCollapsed" class="sidebar-overlay" @click="sidebarCollapsed = true"></div>
      </a-layout>
      <DashboardSettingsDrawer :show-settings-drawer="showSettingsDrawer" :navbar-fixed="navbarFixed"
        :sidebar-theme="sidebarTheme" @toggleSettingsDrawer="toggleSettingsDrawer"
        @toggleNavbarPosition="toggleNavbarPosition" @updateSidebarTheme="updateSidebarTheme"
        @updateSidebarColor="updateSidebarColor"></DashboardSettingsDrawer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DashboardSidebar from '../components/sidebars/dashboardSidebar.vue'
import DashboardHeader from '../components/headers/dashboardHeader.vue'
import DashboardSettingsDrawer from '../components/sidebars/dashboardSettingsDrawer.vue'

@Options({
  components: {
    DashboardSidebar,
    DashboardHeader,
    DashboardSettingsDrawer,
  },
})
/** 主页 */
export default class Dashboard extends Vue {
  sidebarCollapsed = true
  sidebarMinimized = false
  sidebarColor = 'primary'
  sidebarTheme = 'white'
  navbarFixed = false
  showSettingsDrawer = false
  /**
   * 描述
   * @date 2022-01-06
   * @param {any} value
   */
  toggleSidebar(value: boolean) {
    this.sidebarCollapsed = value
  }

  /**
   * 描述
   * @date 2022-01-06
   * @param {any} _value
   */
  minimizeSidebar(_value: boolean) {
    this.sidebarMinimized = !this.sidebarMinimized
  }

  /**
   * 描述
   * @date 2022-01-06
   * @param {any} value
   */
  toggleSettingsDrawer(value: boolean) {
    this.showSettingsDrawer = value
  }

  /**
   * 描述
   * @date 2022-01-06
   * @param {any} value
   */
  toggleNavbarPosition(value: boolean) {
    this.navbarFixed = value
  }

  /**
   * 描述
   * @date 2022-01-0立
   * @param {any} value
   */
  updateSidebarTheme(value: string) {
    this.sidebarTheme = value
  }

  /**
   * 描述
   * @date 2022-01-06
   * @param {any} value
   */
  updateSidebarColor(value: string) {
    this.sidebarColor = value
  }
  /**
   * 描述
   * @date 2022-01-06
   */
  get layoutClass() {
    return this.$route.meta.layoutClass
  }
}
</script>
