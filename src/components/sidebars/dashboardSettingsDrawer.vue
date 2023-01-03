<template>
  <a-drawer
    class="settings-drawer"
    :class="[rtl ? 'settings-drawer-rtl' : '']"
    :placement="rtl ? 'left' : 'right'"
    :closable="false"
    :visible="showSettingsDrawer"
    width="360"
    :get-container="() => wrapper"
    @close="$emit('toggleSettingsDrawer', false)"
  >
    <a-button type="link" class="btn-close" @click="$emit('toggleSettingsDrawer', false)">
      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9">
        <g id="close" transform="translate(0.75 0.75)">
          <path
            id="Path"
            d="M7.5,0,0,7.5"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="1.5"
          />
          <path
            id="Path-2"
            data-name="Path"
            d="M0,0,7.5,7.5"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="1.5"
          />
        </g>
      </svg>
    </a-button>
    <div class="drawer-content">
      <h6>设置</h6>
      <p>查看仪表板选项</p>
      <hr />
      <div class="sidebar-color">
        <h6>侧边栏的颜色</h6>
        <a-radio-group
          v-model:value="sidebarColorModel"
          default-value="primary"
          @change="$emit('updateSidebarColor', $event.target.value)"
        >
          <a-radio-button value="primary" class="bg-primary"></a-radio-button>
          <a-radio-button value="secondary" class="bg-secondary"></a-radio-button>
          <a-radio-button value="success" class="bg-success"></a-radio-button>
          <a-radio-button value="danger" class="bg-danger"></a-radio-button>
          <a-radio-button value="warning" class="bg-warning"></a-radio-button>
          <a-radio-button value="black" class="bg-dark"></a-radio-button>
        </a-radio-group>
      </div>
      <div class="sidenav-type">
        <h6>侧边栏样式</h6>
        <p>选择2种不同的侧边栏类型</p>
        <a-radio-group
          v-model:value="sidebarThemeModel"
          button-style="solid"
          default-value="primary"
          @change="$emit('updateSidebarTheme', $event.target.value)"
        >
          <a-radio-button value="light">透明</a-radio-button>
          <a-radio-button value="white">白色的</a-radio-button>
        </a-radio-group>
      </div>
      <div class="navbar-fixed">
        <h6>导航条固定</h6>
        <a-switch
          v-model:checked="navbarFixedModel"
          default-checked
          @change="$emit('toggleNavbarPosition', navbarFixedModel)"
        />
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { prop, Vue } from 'vue-class-component'
/** 属性 */
class Props {
  showSettingsDrawer = prop({
    type: Boolean,
    default: false,
  })
  sidebarColor = prop({
    type: String,
    default: 'primary',
  })
  sidebarTheme = prop({
    type: String,
    default: 'light',
  })
  navbarFixed = prop({
    type: Boolean,
    default: false,
  })
  rtl = prop({
    type: Boolean,
    default: false,
  })
}
/** 左边设置项 */
export default class DashboardSettingsDrawer extends Vue.with(Props) {
  wrapper = document.body
  sidebarColorModel = this.sidebarColor ?? 'primary'
  sidebarThemeModel = this.sidebarTheme ?? 'light'
  navbarFixedModel = this.navbarFixed ?? false
  /** mounted  */
  mounted() {
    this.wrapper = document.getElementById('layout-dashboard') ?? document.body
  }
}
</script>
