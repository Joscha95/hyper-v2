import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/Index.vue'
import About from '@/views/About.vue'
import Stage from '@/views/Stage.vue'
import Login from '@/views/Login.vue'
import Error from '@/views/Error.vue'
import Reset from '@/views/Reset.vue'
import Sequence from '@/views/Sequence.vue'
import Test from '@/views/Test.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
	{ path: '/', name: 'Index', component: Index },
	{ path: '/about', name: 'About', component: About },
	{ path: '/test', name: 'Test', component: Test },
	{ path: '/oh/no', name: 'Error', component: Error },
	{ path: '/reset/:auth', name: 'Reset', component: Reset },
	{ path: '/log/in', name: 'Login', component: Login, props: true },
	{ path: '/:slug', name: 'Stage', component: Stage },
	{ path: '/my/sequence', name: 'Sequence', component: Sequence, props: true },
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, alias: '/not/found' }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router