import Vue from 'vue';
import Router from 'vue-router';

const MainPage = (resolve) => {require.ensure([],function(require){resolve(require('../page/MainPage.vue'))},'cweb/requireJs/MainPage')};
// const MainPage = import(/* webpackChunkName:"cweb/requireJs/MainPage" */ '../page/MainPage.vue').then(module => module);
Vue.use(Router);
export default new Router({
	mode: 'history',
	base:'cweb',
	routes: [
		{path: '/main', name: 'MainPage', component: MainPage}
	]
});