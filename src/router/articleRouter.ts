import { IRouter, MenuUtilts } from '@/util/menuUtilts'
const menu = MenuUtilts.ins().getRoute
export const articleRouter: IRouter[] = [
  {
    ...menu(5, 0, 'content-article', '文章管理', 'icon-sycaid4'),
  },
  {
    ...menu(53, 5, 'content/article', '文章列表'),
    component: () => import('../views/content/article/article.vue'),
  },
  {
    ...menu(54, 5, 'content/addArticle', '添加文章'),
    component: () => import('../views/content/article/addArticle/addArticle.vue'),
  },
  {
    ...menu(55, 5, 'content/editArticle/:id', '修改文章', '', true, 'editArticle'),
    component: () => import('../views/content/article/addArticle/addArticle.vue'),
  },
  {
    ...menu(56, 5, 'content/articleClassify', '文章分类'),
    component: () => import('../views/content/article/articleClassify/articleClassify.vue'),
  },
]
