import { IRouter, MenuUtilts } from '@/util/menuUtilts'
const menu = MenuUtilts.ins().getRoute
export const videoRouter: IRouter[] = [
  {
    ...menu(6, 0, 'content-video', '视频管理', 'icon-sycaid5'),
  },
  {
    ...menu(61, 6, 'content/video', '视频列表'),
    component: () => import('../views/content/video/video.vue'),
  },
  {
    ...menu(62, 6, 'content/addVideo', '添加视频'),
    component: () => import('../views/content/video/addVideo/addVideo.vue'),
  },
  {
    ...menu(63, 6, 'content/videoClassify', '视频分类', '', false, 'videoClassify'),
    component: () => import('../views/content/video/videoClassify/videoClassify.vue'),
  },
  {
    ...menu(64, 6, 'content/editVideo/:id', '修改视频', '', true, 'editVideo'),
    component: () => import('../views/content/video/addVideo/addVideo.vue'),
  },
]
