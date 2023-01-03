import { MenuUtilts } from './../util/menuUtilts'
import { IRouter } from '@/util/menuUtilts'
const menu = MenuUtilts.ins()
export const settingRouter: IRouter[] = [
  {
    ...menu.getRoute(8, 0, 'setting', '系统管理', 'icon-sycaid7'),
    component: () => import('../views/test/test.vue'),
  },
  {
    ...menu.getRoute(81, 8, 'setting/code', '跟踪代码', 'icon-wodechanpin'),
    component: () => import('../views/setting/code/index.vue'),
  },
  {
    ...menu.getRoute(81, 8, 'setting/advSetting', '高级设置', 'icon-wodechanpin'),
    component: () => import('../views/setting/advSetting/advSetting.vue'),
  },
  {
    ...menu.getRoute(81, 8, 'setting/designCode', '装修代码', ''),
    component: () => import('../views/setting/designCode/designCode.vue'),
  },
]
