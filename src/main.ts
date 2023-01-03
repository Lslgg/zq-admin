import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import MediaImage from './components/media/image.vue'
import MediaText from './components/media/text.vue'
import MediaStatus from './components/media/status.vue'
import MediaLink from './components/media/link.vue'
import DefaultLayout from './layouts/default.vue'
import DashboardLayout from './layouts/dashboard.vue'
import BlankLayout from './layouts/blank.vue'
import './scss/app.scss'
import './index.css'
import 'ant-design-vue/lib/message/style/index.css'
import 'ant-design-vue/lib/modal/style/index.css'

/**
 * 描述
 * @date 2022-03-23
 */
function start() {
  const app = createApp(App)
  app.component('MediaImage', MediaImage)
  app.component('MediaText', MediaText)
  app.component('MediaStatus', MediaStatus)
  app.component('MediaLink', MediaLink)
  app.component('LayoutDefault', DefaultLayout)
  app.component('LayoutDashboard', DashboardLayout)
  app.component('LayoutBlank', BlankLayout)
  app.use(i18n)
  app.use(router)
  app.mount('#app')
}

globalSdk.init().then(() => start())

