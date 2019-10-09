<script>
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
		<button @click="getUser">登录login</button>
		<pre v-html="userInfo" />
		<button @click="getList">获取菜单cweb</button>
		<pre v-html="list"/>
		<router-view></router-view>
	</div>
</template>

<style lang='less'>
	h2 {
		font-size: 12px;
		color: green;
	}
</style>