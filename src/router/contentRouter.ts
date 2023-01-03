import { IRouter } from '@/util/menuUtilts'
// const menu = MenuUtilts.ins().getRoute
// export const contentRouter: IRouter[] = [
//   {
//     ...menu(4, 0, 'content', '内容管理', 'icon-laobanbaobiao'),
//   },
//   {
//     ...menu(41, 4, 'content/product', '产品管理'),
//     component: () => import('../views/content/product/product.vue'),
//   },
//   {
//     ...menu(411, 41, 'content/addProduct', '添加产品', '', true),
//     component: () => import('../views/content/product/addProduct/addProduct.vue'),
//   },
//   {
//     ...menu(411, 41, 'content/classify/:type', '产品分类', '', true, 'productClassify'),
//     component: () => import('../views/content/classify/classify.vue'),
//   },
//   {
//     ...menu(42, 4, 'content/params', '产品参数'),
//     component: () => import('../views/content/params/params.vue'),
//   },
//   {
//     ...menu(421, 42, 'content/addParams/:id', '修改产品参数', '', true, 'editParams'),
//     component: () => import('../views/content/params/addParams/addParams.vue'),
//   },
//   {
//     ...menu(421, 42, 'content/addParams', '添加产品参数', '', true),
//     component: () => import('../views/content/params/addParams/addParams.vue'),
//   },
//   {
//     ...menu(43, 4, 'content/article', '文章管理'),
//     component: () => import('../views/content/article/article.vue'),
//   },
//   {
//     ...menu(431, 43, 'content/addArticle', '添加文章', '', true),
//     component: () => import('../views/content/article/addArticle/addArticle.vue'),
//   },
//   {
//     ...menu(431, 43, 'content/editArticle/:id', '修改文章', '', true, 'editArticle'),
//     component: () => import('../views/content/article/addArticle/addArticle.vue'),
//   },
//   {
//     ...menu(431, 43, 'content/classify/:type', '文章分类', '', true, 'articleClassify'),
//     component: () => import('../views/content/classify/classify.vue'),
//   },
//   {
//     ...menu(44, 4, 'content/video', '视频列表'),
//     component: () => import('../views/content/video/video.vue'),
//   },
//   {
//     ...menu(431, 43, 'content/addVideo', '添加视频', '', true),
//     component: () => import('../views/content/video/addVideo/addVideo.vue'),
//   },
//   {
//     ...menu(431, 43, 'content/classify/:type', '视频分类', '', true, 'videoClassify'),
//     component: () => import('../views/content/classify/classify.vue'),
//   },
//   // { menuter(45, 4, 'content/recycle', '内容回收站'), component: () => import('../views/test/test.vue') },
// ]

import { productRouter } from './productRouter'
import { articleRouter } from './articleRouter'
import { videoRouter } from './videoRouter'

export const contentRouter: IRouter[] = [
  ...productRouter,
  ...articleRouter,
  ...videoRouter
]
