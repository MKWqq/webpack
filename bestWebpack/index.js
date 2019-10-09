const axf = require('axf-koa-utils');
const APP_PORT = process.env.APP_PORT || 9900;
const mount = require('koa-mount');
const serve = require('koa-static');
const Koa = require('koa');
const path = require('path');
const koaWac = require('./koa/instance/wac');
const koaCweb = require('./koa/instance/cweb');
const koaFee = require('./koa/instance/fee');
/**
 * 公共静态资源koa
 */
const commonStatic = new Koa();

/**
 * 创建最外层Koa
 */
const wrapper = new Koa();
wrapper.silent = true;
wrapper.use(async (ctx, next) => {
	ctx.originalURL = ctx.url;
	// ctx.body = IndexHTML;
	await next();
});

wrapper.use(axf.utils.serveFavicon);
wrapper.use(mount('/static', commonStatic.use(serve(path.resolve(__dirname, 'dist/static')))));

//开发环境的热加载支持
if (process.env.NODE_ENV === 'development' && !process.env.Dev_webpack) {
	console.log('develop mode, starting webpack hot module replacement ... ');
	const koaWebpack = require('koa-webpack');
	const webpackConfig = require('./webpack.config.develop');

	koaWebpack({
		config: webpackConfig,
		hotClient: {allEntries: true}
	}).then(middleware => {
		wrapper.use(middleware);
		wrapper.use(async (ctx, next) => {
			ctx.middleware = middleware;
			await next();
		});
		wrapper.use(mount('/wac', koaWac));
		wrapper.use(mount('/cweb', koaCweb));
		wrapper.use(mount('/fee', koaFee));
	});
} else {
	wrapper.use(mount('/wac', koaWac));
	wrapper.use(mount('/cweb', koaCweb));
	wrapper.use(mount('/fee', koaFee));
}

wrapper.listen(APP_PORT, () => {
	console.log('axf server started on port', APP_PORT);
});