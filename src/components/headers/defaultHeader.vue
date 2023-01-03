<template>
  <a-layout-header>
    <div class="header-col header-brand">
      <h6>全球科技有限公司</h6>
      <a-button type="link" class="btn-menu-trigger" @click="collapseNav = collapseNav ? 0 : 1">
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
          />
        </svg>
      </a-button>
    </div>
    <div class="header-col header-nav">
      <a-menu mode="horizontal" class="menu-large">
        <a-sub-menu>
          <template #title>
            <span class="submenu-title-wrapper">
              <router-link to="/admin" class="nav-link">
                <span>管理中心</span>
              </router-link>
            </span>
          </template>
        </a-sub-menu>
        <template v-for="menu in menuList">
          <template v-if="menu.subMenu && menu.subMenu.length === 0">
            <a-sub-menu :key="menu.key">
              <template #title>
                <span class="submenu-title-wrapper">
                  <router-link :to="menu.url" class="nav-link">
                    <!-- <a-icon :type="menu.icon" theme="filled" class="m-0" /> -->
                    <span>{{ menu.name }}</span>
                  </router-link>
                </span>
              </template>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-sub-menu :key="menu.key">
              <template #title>
                <span class="submenu-title-wrapper">
                  <!-- <a-icon :type="menu.icon" theme="filled" class="m-0" /> -->
                  <span>{{ menu.name }}</span>
                </span>
              </template>
              <a-menu-item v-for="subMenu in menu.subMenu" :key="subMenu.key">
                <router-link :to="subMenu.url">
                  <span class="label">{{ subMenu.name }}</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </template>
      </a-menu>
      <div class="menu-small">
        <a-collapse :vmodel:activeKey="collapseNav" accordion>
          <a-collapse-panel key="1">
            <a-menu mode="inline" :open-keys="openKeys" @openChange="onOpenChange">
              <a-menu-item>
                <router-link to="/admin">
                  <span class="icon">
                    <!-- <a-icon type="code" theme="filled" class="m-0" /> -->
                  </span>
                  <span class="label">管理中心</span>
                </router-link>
              </a-menu-item>
              <template v-for="menu in menuList">
                <template v-if="menu.subMenu && menu.subMenu.length === 0">
                  <a-menu-item :key="menu.key">
                    <router-link :to="menu.url">
                      <span class="icon">
                        <!-- <a-icon :type="menu.icon" theme="filled" class="m-0" /> -->
                      </span>
                      <span class="label">{{ menu.name }}</span>
                    </router-link>
                  </a-menu-item>
                </template>
                <template v-else>
                  <a-sub-menu :key="menu.key" style="padding: 0">
                    <template #title>
                      <span>
                        <span class="icon">
                          <!-- <a-icon
                            :type="menu.icon"
                            theme="filled"
                            class="m-0"
                          />-->
                        </span>
                        <span class="label">{{ menu.name }}</span>
                      </span>
                    </template>
                    <a-menu-item-group>
                      <a-menu-item v-for="subMenu in menu.subMenu" :key="subMenu.key">
                        <router-link :to="subMenu.url">
                          <span class="label">{{ subMenu.name }}</span>
                        </router-link>
                      </a-menu-item>
                    </a-menu-item-group>
                  </a-sub-menu>
                </template>
              </template>
            </a-menu>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import { IMenu, MenuUtilts } from '@/util/menuUtilts'
import { Vue } from 'vue-class-component'
/** 默认头部 */
export default class DefaultHeader extends Vue {
  collapseNav = 0
  sidebarCollapsed = false
  sidebarColor = 'primary'
  sidebarTheme = 'light'
  rootSubmenuKeys = [
    'admin',
    'pages',
    'applications',
    'ecommerce',
    'authentication',
    'basic',
    'components',
    'changelog',
  ]
  openKeys: any = []

  /** 获取菜单 */
  get menuList(): IMenu[] {
    const menuList: IMenu[] = MenuUtilts.ins().menuList
    return menuList
  }

  /**
   * 链接改变方法
   * @date 2022-01-06
   * @param {any} openKeys:any[]
   */
  onOpenChange(openKeys: any[]) {
    this.openKeys = this.openKeys ?? this.$route.meta.sidebarMap
    const latestOpenKey = openKeys.find((key) => {
      return this.openKeys.indexOf(key) === -1
    })
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.openKeys = openKeys
    } else {
      this.openKeys = latestOpenKey ? [latestOpenKey] : []
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-link svg {
  margin-right: 5px;
  vertical-align: middle;
}
.nav-link span {
  vertical-align: middle;
}
.ant-menu-submenu-popup {
  width: 100%;
}
</style>
