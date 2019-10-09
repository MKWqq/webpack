import Vue from 'vue';
import Router from 'vue-router';

const MainPage = (resolve) => {require.ensure([],function(require){resolve(require('../page/MainPage.vue'))},'fee/requireJs/MainPage')};

Vue.use(Router);
export default new Router({
	mode: 'history',
	base:'fee',
	routes: [
		{path: '/main', name: 'MainPage', component: MainPage}
	]
});