import { IRouter, MenuUtilts } from '@/util/menuUtilts'
const menu = MenuUtilts.ins().getRoute
export const productRouter: IRouter[] = [
  {
    ...menu(4, 0, 'content-product', '产品管理', 'icon-sycaid1'),
  },
  {
    ...menu(41, 4, 'content/product', '产品列表'),
    component: () => import('../views/content/product/product.vue'),
  },
  {
    ...menu(42, 4, 'content/addProduct', '添加产品'),
    component: () => import('../views/content/product/addProduct/addProduct.vue'),
  },
  {
    ...menu(42, 4, 'content/editProduct/:id', '编辑产品', '', true, 'editProduct'),
    component: () => import('../views/content/product/addProduct/editProduct.vue'),
  },
  {
    ...menu(43, 4, 'content/productClassify', '产品分类'),
    component: () => import('../views/content/product/productClassify/productClassify.vue'),
  },
  {
    ...menu(44, 4, 'content/params', '参数设置'),
    component: () => import('../views/content/params/params.vue'),
  },
  {
    ...menu(45, 4, 'content/addParams/:id', '修改产品参数', '', true, 'editParams'),
    component: () => import('../views/content/params/addParams/addParams.vue'),
  },
  {
    ...menu(46, 4, 'content/addParams', '添加产品参数', '', true),
    component: () => import('../views/content/params/addParams/addParams.vue'),
  },
]
