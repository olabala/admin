import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

Vue.use(Router)
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}, {
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}, {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: { title: '首页', icon: 'dashboard' }
  }]
}, {
  path: '/users',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Users',
    component: () => import('@/views/users/index'),
    meta: { title: '人员管理', icon: 'peoples' }
  }]
}, {
  path: '/data',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Data',
    component: () => import('@/views/data/index'),
    meta: { title: '数据管理', icon: 'tab' }
  }]
}, {
  path: '/labels',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Labels',
    component: () => import('@/views/labels/index'),
    meta: { title: '标签管理', icon: 'label' }
  }]
}, {
  path: '/departments',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Departments',
    component: () => import('@/views/department/index'),
    meta: { title: '组织架构', icon: 'tree' }
  }]
}, {
  // 404 page must be placed at the end !!!
  path: '*',
  redirect: '/404',
  hidden: true
}]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
