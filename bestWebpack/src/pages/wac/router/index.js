import Vue from 'vue';
import Router from 'vue-router';

// const MainPage = () => import ('../page/MainPage.vue');
// const _baseStatic='';
// const _baseStatic='wac/requireJs';
const MainPage = (resolve) => {require.ensure([],function(require){resolve(require('../page/MainPage.vue'))},'wac/requireJs/MainPage')};
const MainPageChild = (resolve) => {require.ensure([],function(require){resolve(require('../page/MainPageChild.vue'))},'wac/requireJs/MainPage')};
// const MainPage = import(/* webpackChunkName:"wac/requireJs/MainPage" */ '../page/MainPage.vue').then(module => module);
// const MainPageChild = import(/* webpackChunkName:"wac/requireJs/MainPageChild" */ '../page/MainPageChild.vue').then(module => module);

Vue.use(Router);
export default new Router({
	mode: 'history',
	base: 'wac',
	routes: [
		{
			path: '/main', name: 'MainPage', component: MainPage,
			children: [
				{path: 'MainPageChild', component: MainPageChild}
			]
		}
	]
});