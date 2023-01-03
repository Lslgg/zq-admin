import { MenuUtilts } from './../util/menuUtilts'
import { IRouter } from '@/util/menuUtilts'
const menu = MenuUtilts.ins()
export const webSiteRouter: IRouter[] = [
  {
    ...menu.getRoute(3, 0, 'webSite', '网站管理', 'icon-sycaid3'),
  },
  {
    ...menu.getRoute(31, 3, 'webSite/base', '基础信息', '', false, 'webSiteBase'),
    component: () => import('../views/site/base/index.vue'),
  },
  {
    ...menu.getRoute(33, 3, 'webSite/navigation', '导航菜单'),
    component: () => import('../views/site/navigation/navigation.vue'),
  },
  {
    ...menu.getRoute(33, 3, 'optimization/column', '栏目优化'),
    component: () => import('../views/optimization/column/index.vue'),
  },
  {
    ...menu.getRoute(34, 3, 'optimization/page', '页面优化'),
    component: () => import('../views/optimization/page/index.vue'),
  },
  {
    ...menu.getRoute(35, 3, 'optimization/keywords', '关键词库'),
    component: () => import('../views//optimization/keywords/keywords.vue'),
  },
  {
    ...menu.getRoute(351, 35, 'optimization/keywordImport', '关键词库导入', '', false, 'keywordImport'),
    component: () => import('../views//optimization/keywords/keywordImport.vue'),
  },
  {
    ...menu.getRoute(36, 3, 'webSite/online', '在线客服'),
    component: () => import('../views/site/online/online.vue'),
  },
  {
    ...menu.getRoute(37, 3, 'webSite/material', '素材库'),
    component: () => import('../views/site/material/material.vue'),
  },

]
