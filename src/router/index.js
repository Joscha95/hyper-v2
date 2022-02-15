import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/Index.vue'
import About from '@/views/About.vue'
import Hyper from '@/views/Hyper.vue'

const routes = [
	{ path: '/', name: 'Index', component: Index },
	{ path: '/about', name: 'About', component: About },
	{ path: '/:id', name: 'Hyper', component: Hyper }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router