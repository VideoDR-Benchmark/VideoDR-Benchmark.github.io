import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/Home.vue'
import LeaderBoard from '../views/LeaderBoard.vue'
import globalConfig from '../../global-layout-config.json'
import homeConfig from '../../home-config.json'
import leaderboardConfig from '../../leaderboard-config.json'

const routes = [
  {
    path: '/',
    redirect: '/leaderboard'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: {
      title: homeConfig.pageMetadata.title || globalConfig.projectInfo.name
    }
  },
  /*
  {
    path: '/report',
    name: 'Report',
    beforeEnter() {
      // 跳转到arXiv论文页面
      window.location.href = 'https://github.com/QuantaAlpha/VideoDR-Benchmark'
    }
  },
  */
  {
    path: '/leaderboard',
    name: 'LeaderBoard',
    component: LeaderBoard,
    meta: {
      title: leaderboardConfig.pageMetadata.title || globalConfig.projectInfo.name
    }
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

router.beforeEach((to, from, next) => {
  const title = to.meta.title || globalConfig.projectInfo.name
  document.title = title
  next()
})

export default router
