let CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
const autoprefixer = require('autoprefixer');
const flexbugs = require("postcss-flexbugs-fixes");
const PurifyCssPlugin = require('purifycss-webpack');
const fs = require('fs');
const glob = require('glob-all');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const os = require('os');
const HappyPack = require('happypack');
const happythreadPool = HappyPack.ThreadPool({size: os.cpus().length});
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const manifest = require("./dll/vue.manifest.json");

function resolve(dir) {
	return path.join(__dirname, dir);
}


let _projectArr = [], _purifyCssArr = [];

try {
	_projectArr = fs.readdirSync(__dirname + '/src/pages')
} catch (e) {
	console.log(e);
}

function getEntry() {
	let _entryObject = {};
	_projectArr.forEach(item => {
		_entryObject[item] = [`./src/pages/${item}/main.js`];
	});
	return _entryObject;
}

function getHtmlPlugin() {
	let _htmlArr = [];
	_projectArr.forEach(item => {
		let _row = new HtmlWebpackPlugin({
			filename: `./${item}/index.html`,
			template: resolve(`./src/pages/${item}/index.template.html`),
			chunks: ['static/commonJs/commons', 'static/commonJs/vendors', item],
			minify: true
		});
		_purifyCssArr.push(resolve(`./src/pages/${item}/page/*.vue`));
		_purifyCssArr.push(resolve(`./src/pages/${item}/*.vue`));
		_htmlArr.push(_row);
	});
	return _htmlArr;
}

module.exports = {
	context: __dirname,
	entry: getEntry(),

	output: {
		filename: `[name]/js/[name]_[chunkhash].js`,
		chunkFilename: '[name]_[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},

	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		'react-router-dom': 'ReactRouterDOM'
	},

	devtool: false,

	resolve: {
		extensions: ['.js', '.vue', '.json'],
/*		// 不能与DllReferencePlugin一起设置
		modules: [resolve("node_modules")],
		mainFields: ['index', 'main'],*/
		alias: {}
	},

	module: {
		noParse: [/jquery/],
		rules: [{
			test: /\.es6?$/,
			use: 'happypack/loader?id=babelES6'
		}, {
			test: /\.jsx?$/,
			use: 'happypack/loader?id=babelJSX',
			exclude: /node_modules/
		}, {
			test: /\.vue$/,
			loader: 'happypack/loader?id=vueLoader'
		}, {
			test: /\.(less|css)$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						plugins: [
							flexbugs,
							autoprefixer({
								overrideBrowserslist: ["last 6 versions", "android >= 4.0", "ios >= 5.0", ">1%", "Firefox ESR", "not ie < 9"]
							})
						]
					}
				},
				'less-loader?sourceMap',
			]
		}, {
			test: /\.(png|jpg|gif|svg)$/,
			loader: "url-loader",
			options: {
				limit: 10000,
				useRelativePath: false,
				outputPath: "static/images/",
				// publicPath:'/',
				name: '[name].[hash:7].[ext]'
			}
		}, {
			test: /\.(ttf|eot|woff|woff2)/,
			loader: "url-loader",
			options: {
				limit: 10000,
				useRelativePath: false,
				outputPath: "static/images/",
				name: '[name].[hash:7].[ext]'
			}
		}]
	},

	plugins: [
		...getHtmlPlugin(),

		new DllReferencePlugin({
			context: __dirname,
			manifest
		}),
		new AddAssetHtmlPlugin({
			filepath: path.resolve(__dirname, './dll/vue.dll.js'),
			outputPath: "static/commonJs",
			publicPath: "/static/commonJs",
			includeSourcemap: false
		}),

		new HappyPack({
			id: "babelES6",
			loaders: ["babel-loader"],
			threadPool: happythreadPool
		}),
		new HappyPack({
			id: "babelJSX",
			loaders: ["babel-loader"],
			threadPool: happythreadPool
		}),
		new HappyPack({
			id: "vueLoader",
			loaders: ["vue-loader"],
			threadPool: happythreadPool
		}),

		new CaseSensitivePathsPlugin({
			debug: false
		}),
		new MiniCssExtractPlugin({
			filename: "[name]/css/[name].css",
			chunkFilename: "[id].css"
		}),
		new PurifyCssPlugin({
			paths: glob.sync(_purifyCssArr)
		}),
		new OptimizeCssAssetsPlugin(),

		new ParallelUglifyPlugin({
			uglifyJS: {
				warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
				output: {
					beautify: false, //不需要格式化
					comments: true //不保留注释
				},
				compress: {
					drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
					collapse_vars: true, // 内嵌定义了但是只用到一次的变量
					reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
				}
			}
		})
	],

	//压缩js optimization.splitChunks
	optimization: {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				// 公共模块抽离
				commons: {
					minChunks: 2, //抽离公共代码时，这个代码块最小被引用的次数
					name: "static/commonJs/commons",
					minSize: 0, // This is example is too small to create commons chunks
					priority: 1
				},
				// 第三方包抽离
				vendors: {
					test: (module) => {
						return /node_modules/.test(module.context);
					},
					minChunks: 2,
					name: 'static/commonJs/vendors',
					priority: 10
				}
			}
		}
	}
};