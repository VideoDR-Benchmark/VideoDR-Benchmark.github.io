import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/Home.vue'
import LeaderBoard from '../views/LeaderBoard.vue'

const routes = [
  {
    path: '/',
    redirect: '/leaderboard'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/report',
    name: 'Report',
    beforeEnter() {
      // 跳转到arXiv论文页面
      window.location.href = 'https://github.com/QuantaAlpha/VideoDR-Benchmark'
    }
  },
  {
    path: '/leaderboard',
    name: 'LeaderBoard',
    component: LeaderBoard
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
