import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import urlScan from '../components/UrlScan'

import centralizedUrlScan from '../components/CentralizedUrlScan'

import fileScan from '../components/FileScan'

import fetchOneFileToScan from '../components/FetchOneFileToScan'
import finalFileScan from '../components/FinalFileScan'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },

  {
    path: '/urlScan',
    name: 'urlScan',
    component: urlScan
  },

  {
    path: '/centralizedUrlScan',
    name: 'centralizedUrlScan',
    component: centralizedUrlScan
  },

  {
    path: '/fileScan',
    name: 'fileScan',
    component: fileScan
  },

  {
    path: '/fetchOneFileToScan',
    name: 'fetchOneFileToScan',
    component: fetchOneFileToScan
  },

  {
    path: '/finalFileScan',
    name: 'finalFileScan',
    component: finalFileScan
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
