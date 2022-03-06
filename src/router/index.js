import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/Index.vue'
import About from '@/views/About.vue'
import Stage from '@/views/Stage.vue'
import Error from '@/views/Error.vue'
import Reset from '@/views/Reset.vue'
import Test from '@/views/Test.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
	{ path: '/', name: 'Index', component: Index },
	{ path: '/about', name: 'About', component: About },
	{ path: '/test', name: 'Test', component: Test },
	{ path: '/oh/no', name: 'Error', component: Error },
	{ path: '/reset/:auth', name: 'Reset', component: Reset },
	{ path: '/:slug', name: 'Stage', component: Stage },
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, alias: '/not/found' }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router