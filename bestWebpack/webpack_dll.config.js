const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

module.exports = {
	context: __dirname,
	entry: {
		vue: ['vue/dist/vue.esm.js', 'vue', 'vue-router']
	},
	output: {
		filename: '[name].dll.js',
		path: path.resolve(__dirname, 'dll'),
		library: '_dll_[name]',  //dll的全局变量名
	},
	plugins: [
		new DllPlugin({
			context: __dirname,
			name: '_dll_[name]',  //[name].manifest.json的name值，与library名字一致
			path: path.join(__dirname, 'dll', '[name].manifest.json')//描述生成的manifest文件
		}),
		new CleanWebpackPlugin()
	]
};