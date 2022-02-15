import { createRouter, createWebHistory } from 'vue-router'

import index from '@/views/index.vue'
import about from '@/views/about.vue'
import hyper from '@/views/hyper.vue'

const routes = [
	{ path: '/', name: 'Index', component: index },
	{ path: '/about', name: 'About', component: about },
	{ path: '/hyper', name: 'Hyper', component: hyper }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router