import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartContainer from '@/components/ChartContainer'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ChartContainer',
    component: ChartContainer,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
