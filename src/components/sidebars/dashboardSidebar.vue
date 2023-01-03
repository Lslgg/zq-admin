
<script setup lang='ts'>
import { IMenu, MenuUtilts } from '@/util/menuUtilts'
import { MyIcon } from '@/components/myIcon'
import { RouteRecordName } from 'vue-router'
import { UseCommon } from '@/util/useCommon'
import { GlobalStore } from '@/util/globalStore'
import { ref, watch } from 'vue'
import { ISiteInfo } from '@/api/api.model'
import { useRoute } from 'vue-router'
/** 属性 */
defineProps({
  sidebarCollapsed: { type: Boolean, default: false },
  minized: { type: Boolean, default: false },
  sidebarColor: { type: String, default: 'primary' },
  sidebarTheme: { type: String, default: 'light' },
})
const selectedKeys = ref<RouteRecordName[]>([])
const rootSubmenuKeys = [
  'admin',
  'webSite',
  'content-product',
  'content-article',
  'content-video',
  'optimization',
  'inquiry',
  'statement',
  'setting'
]
const route = useRoute()
const openKeys = ref<RouteRecordName[]>(['admin'])
// 站点信息
const siteInfo = ref<ISiteInfo>(UseCommon.ins().siteInfo as any)
// 菜单列表
const menuList = MenuUtilts.ins().menuList
openKeys.value = menuList.filter((item: IMenu) => item.id === route?.meta?.pid).map((item: IMenu) => item.key)
const routeName = route.name || ''
selectedKeys.value = [routeName]
// 监听站点信息改变，修改icon,title
GlobalStore.ins().getSiteInfo$().subscribe((data: any) => siteInfo.value = data)
// 监听路由变化，修改菜单高亮展开
watch(() => route.name, (name) => {
  name = name ?? 'admin'
  selectedKeys.value = [name]
  // 设置展开项
  for (let index = 0; index < menuList.length; index++) {
    const item = menuList[index]
    const key = item.subMenu?.find(pp => pp.key === name)
    if (key) {
      openKeys.value = [item.key]
      break
    }
  }
})
const onOpenChange = (keys: any[]) => {
  const latest = keys.find((key) => openKeys.value.indexOf(key) === -1)
  if (rootSubmenuKeys.indexOf(latest) === -1) openKeys.value = keys
  else openKeys.value = latest ? [latest] : []
}
const onSelect = (params: { key: string, selectedKeys: string[] }) => {
  if (params.key === 'admin') openKeys.value = ['admin']
}
</script>

<template>
  <!-- Main Sidebar -->
  <a-layout-sider collapsible class="sider-primary" breakpoint="lg" :width="250" :collapsed-width="0"
    :collapsed="sidebarCollapsed" :trigger="null" :class="[
      'ant-layout-sider-' + sidebarColor,
      'ant-layout-sider-' + sidebarTheme,
    ]" theme="light" :style="{ backgroundColor: 'transparent' }" @collapse="$emit('toggleSidebar', !sidebarCollapsed)">
    <router-link to="/" class="flex items-center justify-center cursor-pointer">
      <MediaImage v-if="!siteInfo?.icon?.url" class="h-10" src="/images/mylogo/zbirds.svg" :preview="false" />
      <MediaImage v-else-if="siteInfo?.icon?.url" class="h-10" :src="siteInfo?.icon?.url" :preview="false" />
      <MediaText v-if="!siteInfo?.company_short_name" text="云" :rows="1"
        class="brand_logo font-bold text-xl px-2 leading-none w-42" />
      <MediaText v-else-if="siteInfo?.company_short_name" :text="siteInfo?.company_short_name" :rows="1"
        class="brand_logo font-bold text-xl px-2 leading-none w-42" />
    </router-link>
    <hr />
    <!-- Sidebar Navigation Menu -->
    <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline" :open-keys="openKeys"
      @openChange="onOpenChange" @select="onSelect">
      <a-menu-item key="admin">
        <router-link to="/admin">
          <span class="icon">
            <MyIcon class="!text-base text-[#888]" name="icon-sycaid6"></MyIcon>
          </span>
          <span class="label">首页</span>
        </router-link>
      </a-menu-item>
      <template v-for="menu in menuList">
        <template v-if="menu.subMenu && menu.subMenu.length === 0">
          <a-menu-item :key="menu.key">
            <router-link :to="menu.url">
              <span class="icon">
                <MyIcon class="!text-base text-[#888]" :name="menu.icon"></MyIcon>
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
                  <MyIcon class="!text-base text-[#888]" :name="menu.icon"></MyIcon>
                </span>
                <span class="label">{{ menu.name }}</span>
              </span>
            </template>
            <a-menu-item-group>
              <a-menu-item v-for="subMenu in menu.subMenu" :key="subMenu.key" class>
                <a-tooltip v-if="minized" placement="rightTop">
                  <template #title>
                    <span>{{ subMenu.name }}</span>
                  </template>
                  <router-link :to="subMenu.url">
                    <span class="label">{{ subMenu.name }}</span>
                  </router-link>
                </a-tooltip>
                <router-link v-else :to="subMenu.url">
                  <span class="label">{{ subMenu.name }}</span>
                </router-link>
              </a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<style lang="scss" scoped>
:deep(.ant-menu-title-content) {
  overflow: visible !important;
}

:deep(.ant-menu-item a) {
  display: block;
}

:deep(.router-link-active .icon span) {
  color: white;
}

:deep(.ant-menu-submenu-selected .icon span) {
  color: white;
}

:deep(.ant-menu-submenu-active .icon span) {
  color: white;
}
</style>
