import Vue from 'vue'
import VueRouter from 'vue-router'

// 该文件编写全局路由配置
Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            // 设置URL
            path: '/home',
            // 设置对应组件
            component: () => import(/* webpackChunkName: "home" */ '../components/page/Home.vue'),
            // 设置相应元信息
            meta: { title: 'Home组件', requireAuth: true }
        },
        {
            path: '/interaction',
            name: 'interaction',
            component: () => import('../components/page/Interaction.vue')
        },
        {
            path: '/gameHome',
            component: () => import(/* webpackChunkName: "pageHome" */ '../components/page/gameHome.vue'),
            // 设置相应元信息
            meta: { title: 'gameHome组件', requireAuth: true },
        }
    ]
})


