import index from './pages/index/index.vue';
import custom from './pages/custom/custom.vue';
import app from './pages/app/app.vue';
import school from './pages/app/school.vue';
import contaction from './pages/contaction/contaction.vue';
import subClassification from './pages/subClassification/subClassification.vue';
import billDetail from './pages/bill/billDetail.vue';
import notFoundComponent from './pages/notFoundComponent/notFoundComponent.vue';

export default {
	//mode: 'history',
	routes: [{
		path: '/',
		name: 'index',
		component: index
	}, {
		path: '/custom',
		name: 'custom',
		component: custom
	}, {
		path: '/app',
		name: 'app',
		component: app
	}, {
		path: '/school',
		name: 'school',
		component: school
	}, {
		path: '/contaction',
		name: 'contaction',
		component: contaction
	}, {
		path: '/subClassification',
		name: 'subClassification',
		component: subClassification
	}, {
		path: '/billDetail',
		name: 'billDetail',
		component: billDetail
	}
	// , {
	// 	path: '*',
	// 	name: 'notFoundComponent',
	// 	component: notFoundComponent
	// }
	],
	scrollBehavior(to, from, savedPosition) {
		// if (savedPosition) {
		// 	return savedPosition
		// } else {
		return {
			x: 0,
			y: 0
		}
		// }
	}
};