/**/
const axf = require('axf-koa-utils');
const router = require('koa-router')();
const path = require('path');
const outputPath = require('../../webpack.config.develop').output.path;

const app = axf.utils.createKoaServer('/', path.resolve(__dirname ,'../..', 'dist/fee'));

//输出首页
let IndexHTML;

if (process.env.NODE_ENV === 'production') {
	IndexHTML=require('fs').readFileSync(path.resolve(__dirname,'../../','dist/fee/index.html'), 'utf8');
}

// 可选，传入config配置文件，写在最前面！important
app.use(async (ctx, next) => {
	ctx.sch_api = require('../../config/axf-tang.json');
	ctx.sch_cfg = require('../../config/axf-tang.conf');
	await next();
});

app.use(async (ctx, next) => {
	console.log(ctx.originalURL,ctx.url);
	if (ctx.method === 'GET') {
		ctx.response.type = 'html';
		if(process.env.NODE_ENV === 'development'){
			// console.log(ctx.middleware.devMiddleware.fileSystem.readFileSync(path.resolve(outputPath, `./${ctx.mountPath.replace(/\//,'')}.index.dev.html`)));
			IndexHTML=ctx.middleware?ctx.middleware.devMiddleware.fileSystem.createReadStream(path.resolve(outputPath, `./${ctx.mountPath.replace(/\//,'')}/index.dev.html`))
				:'输出错误'
		}
		ctx.body = IndexHTML;
	}
	await next();
});


app.use(async (ctx, next) => {
	if (ctx.method === 'GET') {
		IndexHTML.replace&&IndexHTML.replace('{$USER_INFO}', JSON.stringify(ctx.auth));
	} else {
		await next();
	}
});


// api
router.post('/api', axf.getApiMiddleware(path.resolve(__dirname,'..','apis')));

app.use(router.routes());

module.exports = app;