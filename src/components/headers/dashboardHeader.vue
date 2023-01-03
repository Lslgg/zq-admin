
<script setup lang="ts">
import {
  MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined,
  DownOutlined, EyeOutlined, SoundOutlined
} from '@ant-design/icons-vue'
import { UseCommon } from '@/util/useCommon'
import { API } from '@/api/apis'
import { reactive, ref, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { GlobalStore } from '@/util/globalStore'
const route = useRoute()
/** 属性 */
defineProps({
  /** 关闭弹窗 */
  visible: { type: Boolean, default: false },
  navbarFixed: { type: Boolean, default: false },
  sidebarCollapsed: { type: Boolean, default: false },
})
/** 头部组件 */
const top = ref(0)
const redNum = ref(0)
const user = reactive({ name: '', mobile: 'none' })
/** breadcrumbs */
const breadcrumbs = computed({
  get: () => (route.meta.breadcrumbs as []) ?? [],
  set: (val) => { },
})
const resizeEventHandler = () => top.value = top.value ? 0 : -0.01
/** 创建 */
window.addEventListener('resize', resizeEventHandler)
/** 注销 */
onUnmounted(() => window.removeEventListener('resize', resizeEventHandler))
const logout = () => UseCommon.ins().logOut()
/** 预览网站 */
const onPrivew = async () => {
  UseCommon.ins().getPrivateUrl().then(privateHost => {
    window.open(`//${privateHost}`, '_blank')
  })
}
// 跳转去询盘列表
const onInquiryList = () => UseCommon.ins().goUrlName('inquiryList')
// 获取用户信息
API.user.getUserInfo<any>({}).then(resData => {
  if (resData.data) {
    user.name = resData.data.name
    user.mobile = resData.data.mobile
  }
})
// 获取未读询盘数量
const getOnRedNum = async () => {
  interface IReacTyep { is_read: number, is_read_text: string, num: number }
  API.data.getDataInquirycount<{ is_read: IReacTyep[] }>({ type: 'is_read' }).then(resData => {
    if (resData.data?.is_read?.length > 0) {
      redNum.value = resData.data.is_read.find(p => p.is_read === 0)?.num ?? 0
    }
  })
}
getOnRedNum()
// 监听查看询盘详情信息修改未读询盘数
GlobalStore.ins().getInquiryMessage$().subscribe(() => getOnRedNum())
</script>

<template>
  <component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">
    <a-layout-header>
      <div class="flex items-center">
        <div class="header_breadcrumb">
          <a-breadcrumb>
            <template v-for="(item, key) in breadcrumbs">
              <a-breadcrumb-item v-if="key == breadcrumbs.length - 1" :key="key">{{ item }}</a-breadcrumb-item>
              <a-breadcrumb-item v-else :key="key + '1'">
                <router-link to="/">{{ item }}</router-link>
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
        </div>
        <div class="sidebar-toggler-col pl-3">
          <div type="link" class="sidebar-toggler flex items-center"
            @click="$emit('minimizeSidebar'), resizeEventHandler()">
            <menu-fold-outlined v-if="top === 0" />
            <menu-unfold-outlined v-else />
          </div>
        </div>
        <div class="header-control">
          <div class="flex space-x-4 items-center">
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link flex items-center" @click.prevent>
                <a-badge :count="redNum" :class="{ '!leading-[0]': redNum === 0 }">
                  <sound-outlined />
                </a-badge>
                <span>消息</span>
              </a>
              <template #overlay>
                <div v-if="redNum > 0" class="flex justify-between bg-white p-2 px-3 min-w-[200px] shadow rounded">
                  <div>您有{{ redNum }}个未读询盘</div>
                  <div>
                    <a @click="onInquiryList" class="text-primary"> 去查看 </a>
                  </div>
                </div>
                <div v-else class="bg-white p-2 px-3 min-w-[200px] shadow rounded text-center">
                  <span>暂无消息通知</span>
                </div>
              </template>
            </a-dropdown>
            <a-button @click="onPrivew" class="flex items-center leading-none shadow-none border-0">
              <template #icon>
                <eye-outlined class="text-xl" />
              </template>
              <span class="leading-none text-sm">预览网站</span>
            </a-button>
            <!-- <a-dropdown>
              <div class="flex justify-start items-center leading-none">
                <span>语言:</span>
                <a class="ant-dropdown-link" @click.prevent>
                  <span>英文</span>
                </a>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item>中文</a-menu-item>
                  <a-menu-item>英文</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>-->
            <a-dropdown>
              <a class="ant-dropdown-link flex justify-start items-center space-x-2" @click.prevent>
                <user-outlined class="leading-none" />
                <span class="text-md leading-none">{{ user.name }}</span>
                <down-outlined />
              </a>
              <template #overlay>
                <a-menu class="px-3">
                  <a-menu-item>
                    <div class="flex space-x-2 items-center">
                      <a-avatar size="large">
                        <template #icon>
                          <user-outlined />
                        </template>
                      </a-avatar>
                      <span>{{ user.mobile }}</span>
                    </div>
                  </a-menu-item>
                  <!-- <a-divider class="!my-2" /> -->
                  <!-- <a-menu-item>
                    <a href="javascript:;" class="space-x-1 !text-gray-500">
                      <build-outlined class="text-xl" />
                      <span>装修网站</span>
                    </a>
                  </a-menu-item>-->
                  <!-- <a-menu-item>
                    <a @click="onPrivew" class="space-x-1 !text-gray-500">
                      <eye-outlined class="text-xl" />
                      <span>预览网站</span>
                    </a>
                  </a-menu-item> -->
                  <!-- <a-menu-item>
                    <a href="javascript:;" class="space-x-1 !text-gray-500">
                      <reconciliation-outlined class="text-xl" />
                      <span>新手指引</span>
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" class="space-x-1 !text-gray-500">
                      <clear-outlined class="text-xl" />
                      <span>清理整站缓存</span>
                    </a>
                  </a-menu-item>-->
                  <a-divider class="!my-2 !mb-1" />
                  <a-menu-item>
                    <a href="javascript:;" class="block text-center" @click="logout">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <a-button type="link" class="sidebar-toggler" @click="
            $emit('toggleSidebar', !sidebarCollapsed), resizeEventHandler()
          ">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" />
            </svg>
          </a-button>
        </div>
      </div>
    </a-layout-header>
  </component>
</template>

<style lang="scss" scoped>
:deep(.anticon-question-circle) {
  font-size: 18px;
  padding: 0 7px;
}

.header-control {
  flex: 1;
}
</style>
