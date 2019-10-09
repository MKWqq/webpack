<script>
	import '../../test'
	export default {
		data() {
			return {
				userInfo: {},
				list: {}
			};
		},
		methods: {
			async getUser() {
				let data = await a.api('login', {
					"username": "10012",
					"password": "E10ADC3949BA59ABBE56E057F20F883E",
					"grant_type": "password"
				});
				this.userInfo = data;
			},
			async getList() {
				let list = await a.api('getList', {});
				this.list = list;
			}
		}
	};
</script>

<template>
	<div>
		<button class="test" @click="getUser">登录loginwac</button>
		<pre v-html="userInfo" />
		<button @click="getList">获取菜单1212</button>
		<pre v-html="list"/>
		<router-view></router-view>
	</div>
</template>

<style lang='less'>
</style>