import { IRouter, MenuUtilts } from '@/util/menuUtilts'
const menu = MenuUtilts.ins()
export const marketingRouter: IRouter[] = [
  {
    ...menu.getRoute(6, 0, 'marketing', '营销中心', 'icon-youhuiquan'),
    component: () => import('../views/test/test.vue'),
  },
  {
    ...menu.getRoute(61, 6, 'marketing/aiProduct', 'AI产品'),
    component: () => import('../views/test/test.vue'),
  },
  {
    ...menu.getRoute(62, 6, 'marketing/aiArticle', 'AI文章'),
    component: () => import('../views/test/test.vue'),
  },
  {
    ...menu.getRoute(63, 6, 'marketing/aiCollect', 'AI聚合页'),
    component: () => import('../views/test/test.vue'),
  },
  {
    ...menu.getRoute(64, 6, 'marketing/detection', '视频列表'),
    component: () => import('../views/test/test.vue'),
  },
]
