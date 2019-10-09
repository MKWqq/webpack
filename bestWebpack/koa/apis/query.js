const { javaProxy } = require('axf-koa-utils');

exports.getList = async function(ctx) {
    ctx.log('cookie======', ctx.cookie);
    let data = await javaProxy(ctx, 'upms-sys/sysmenu/listUserMenus', {}, {
        method: "POST",
    });

    return data;
};