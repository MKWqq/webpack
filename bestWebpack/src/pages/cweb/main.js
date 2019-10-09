import Vue from "vue";
import App from './app.vue';
import router from "./router";

const root = document.createElement('div');
document.body.appendChild(root);
window.a = window.axf = require('axf-polyfill').default;

a.config({
	apiEndpoint: '/cweb/api',
	fetchErrorAutoReload: false,
	fetchErrorTimeoutAutoReloadText: '亲，网络开小差了，请点击ok刷新哦！'
});

new Vue({
	router,
	render: (h) => h(App)
}).$mount(root);