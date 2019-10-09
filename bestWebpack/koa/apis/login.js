const { javaProxy } = require('axf-koa-utils');

exports.login = async function (ctx) {
    // ctx.query, ctx.args, ctx.auth, ctx.method
    let getToken = await javaProxy(ctx, 'auth/oauth/token', ctx.args, {
        method: "POST",
        'Content-Type': 'application/x-www-form-urlencoded'
    }).then(res => res.data);

    ctx.log('getToken========', getToken);

    if (getToken.resp_data) {
        let atoken = getToken.resp_data.access_token;
        let btoken = getToken.resp_data.refresh_token;

        ctx.setCookie('atoken', atoken);
        ctx.setCookie('btoken', btoken);
    }

    return getToken;
};