const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const fs=require('fs');

let _projectArr=[];

try{
	_projectArr=fs.readdirSync(__dirname + '/src/pages')
}catch(e){
	console.log(e);
}

function getEntry(){
	let _entryObject={};
	_projectArr.forEach(item=>{
		_entryObject[item]=[`./src/pages/${item}/main.js`];
	});
	return _entryObject
}

function getHtmlPlugin(){
	let _htmlArr=[];
	_projectArr.forEach(item=>{
		let _row=new HtmlWebpackPlugin({
			filename: `./${item}/index.dev.html`,
			template: path.resolve(__dirname, `./src/pages/${item}/index.template.html`),
			chunks:[item],
			minify:true
		});
		_htmlArr.push(_row);
	});
	return _htmlArr;
}


module.exports = {
	entry: getEntry(),

	mode: 'development',
	node: {
		fs: "empty"
	},

	output: {
		filename: './[name]/js/[name]_[hash].js',
		// the output bundle

		chunkFilename:'./static/chunkJs/[name].js',

		path: path.resolve(__dirname, 'dist'),

		publicPath: '/'
		// necessary for HMR to know where to load the hot update chunks
	},

	devtool: 'inline-source-map',

	module: {
		rules: [{
			test: /\.es6?$/,
			use: [
				'babel-loader'
			]
		}, {
			test: /\.vue$/,
			loader: 'vue-loader'
		}, {
			test: /\.(js|jsx)?$/,
			use: [
				'babel-loader'
			],
			exclude: /node_modules/
		}, {
			test: /\.(less|css)$/,
			use: [
				'style-loader?sourceMap',
				'css-loader',
				// 'resolve-url-loader',
				'less-loader?sourceMap'
			]
		}, {
			test: /\.(png|jpg|gif)$/,
			loader: 'file-loader'
		}, {
			test: /\.(svg|ttf|eot|woff|woff2)/,
			loader: 'file-loader'
		}]
	},

	plugins: [
		new CopyWebpackPlugin([{
			from: './src/static',
			to: path.resolve(__dirname, 'dist/static')
		}]),
		new CaseSensitivePathsPlugin({
			debug: false
		}),
		...getHtmlPlugin()
	]
};