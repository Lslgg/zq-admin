import { IRouter, MenuUtilts } from '@/util/menuUtilts'
const menu = MenuUtilts.ins()
export const statementRouter: IRouter[] = [
  {
    ...menu.getRoute(7, 0, 'inquiry', '询盘管理', 'icon-sycaid2'),
    component: () => import('../views/test/test.vue'),
  },
  {
    ...menu.getRoute(71, 7, 'inquiry/list', '我的询盘', '', false, 'inquiryList'),
    component: () => import('../views/statement/inquiry/inquiryList/inquirys.vue'),
  },
  {
    ...menu.getRoute(711, 71, 'inquiry/inquiryDetail/:id', '询盘详情', '', true, 'inquiryDetail'),
    component: () => import('../views/statement/inquiry/detail.vue'),
  },
  {
    ...menu.getRoute(72, 7, 'inquiry/trash', '垃圾询盘'),
    component: () => import('../views/statement/inquiry/inquiryTrash/inquiryTrash.vue'),
  },
  {
    ...menu.getRoute(73, 7, 'inquiry/filter', '过滤规则'),
    component: () => import('../views/statement/inquiry/components/filter.vue'),
  },
  {
    ...menu.getRoute(74, 7, 'inquiry/statistics', '询盘分析'),
    component: () => import('../views/statement/inquiry/components/statistics.vue'),
  },
  {
    ...menu.getRoute(75, 7, 'inquiry/message', '询盘通知'),
    component: () => import('../views/statement/inquiry/components/message.vue'),
  },
]
